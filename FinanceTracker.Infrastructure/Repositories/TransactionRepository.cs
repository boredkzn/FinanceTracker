using FinanceTracker.Application.Common;
using FinanceTracker.Application.Interfaces;
using FinanceTracker.Domain.Entities;
using FinanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace FinanceTracker.Infrastructure.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _db;

    public TransactionRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<PagedResult<Transaction>> GetAllAsync(TransactionQuery query)
    {
        var dbQuery = _db.Transactions
            .Include(t => t.Category)
            .AsQueryable();

        if (query.Type.HasValue)
            dbQuery = dbQuery.Where(t => t.Type == query.Type.Value);

        if (query.CategoryId.HasValue)
            dbQuery = dbQuery.Where(t => t.CategoryId == query.CategoryId.Value);

        if (!string.IsNullOrWhiteSpace(query.Search))
            dbQuery = dbQuery.Where(t => t.Title.Contains(query.Search) || t.Description.Contains(query.Search));

        if (query.StartDate.HasValue)
            dbQuery = dbQuery.Where(t => t.Date >= query.StartDate);

        if (query.EndDate.HasValue)
            dbQuery = dbQuery.Where(t => t.Date <= query.EndDate);
        
        var total = await dbQuery.CountAsync();
        
        var isDesc = query.Order?.ToLower() == "desc";

        dbQuery = (query.SortBy ?? "id").ToLower() switch
        {
            "amount" => isDesc 
                ? dbQuery.OrderByDescending(t => t.Amount) 
                : dbQuery.OrderBy(t => t.Amount),

            "date" => isDesc 
                ? dbQuery.OrderByDescending(t => t.Date) 
                : dbQuery.OrderBy(t => t.Date),

            "title" => isDesc 
                ? dbQuery.OrderByDescending(t => t.Title) 
                : dbQuery.OrderBy(t => t.Title),

            _ => isDesc 
                ? dbQuery.OrderByDescending(t => t.Id) 
                : dbQuery.OrderBy(t => t.Id)
        };

        var data = await dbQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        return new PagedResult<Transaction>(total, query.Page, query.PageSize, data);
    }

    public async Task<Transaction?> GetByIdAsync(int id)
    {
        return await _db.Transactions.Include(t => t.Category).FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task AddAsync(Transaction transaction)
    {
        await _db.Transactions.AddAsync(transaction);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Transaction transaction)
    {
        _db.Transactions.Update(transaction);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var transaction = await _db.Transactions.FindAsync(id);
        if (transaction != null)
        {
            _db.Transactions.Remove(transaction);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Transaction>> GetAnalyticsAsync(DateTime start, DateTime end)
    {
        return await _db.Transactions
            .Include(t => t.Category)
            .Where(t => t.Date >= start && t.Date <= end)
            .ToListAsync();
    }
}
