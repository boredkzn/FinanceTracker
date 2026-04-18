using FinanceTracker.Application.Interfaces;
using FinanceTracker.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionRepository _repo;

    public TransactionsController(ITransactionRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] TransactionQuery query)
    {
        return Ok(await _repo.GetAllAsync(query));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var transaction = await _repo.GetByIdAsync(id);
        if (transaction == null) return NotFound();
        return Ok(transaction);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TransactionDto dto)
    {
        var transaction = new Transaction(
            dto.Title, 
            dto.Description, 
            dto.Amount, 
            dto.Date ?? DateTime.UtcNow, 
            dto.Type, 
            dto.CategoryId);
        
        await _repo.AddAsync(transaction);
        return Ok(transaction);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TransactionDto dto)
    {
        var transaction = await _repo.GetByIdAsync(id);
        if (transaction == null) return NotFound();

        transaction.Title = dto.Title;
        transaction.Description = dto.Description;
        transaction.Amount = dto.Amount;
        transaction.Date = dto.Date ?? DateTime.UtcNow;
        transaction.Type = dto.Type;
        transaction.CategoryId = dto.CategoryId;

        await _repo.UpdateAsync(transaction);
        return Ok(transaction);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repo.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        var data = await _repo.GetAnalyticsAsync(start, end);
        
        var categoryStats = data
            .Where(t => t.Type == TransactionType.Expense)
            .GroupBy(t => new { t.CategoryId, t.Category.Name, t.Category.Icon })
            .Select(g => new { 
                Category = g.Key.Name,
                Icon = g.Key.Icon,
                Total = g.Sum(t => t.Amount),
                Count = g.Count(),
                Average = g.Average(t => t.Amount)
            })
            .OrderByDescending(x => x.Total)
            .ToList();

        var dailyStats = data
            .GroupBy(t => t.Date.Date)
            .Select(g => new {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Income = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
                Expense = g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
            })
            .OrderBy(x => x.Date)
            .ToList();

        return Ok(new {
            TotalIncome = data.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
            TotalExpense = data.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount),
            Balance = data.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount) - data.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount),
            CategoryStats = categoryStats,
            DailyStats = dailyStats
        });
    }
}

public record TransactionDto(string Title, string? Description, decimal Amount, DateTime? Date, TransactionType Type, int CategoryId);
