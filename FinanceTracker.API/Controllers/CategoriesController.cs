using FinanceTracker.Application.Interfaces;
using FinanceTracker.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryRepository _repo;

    public CategoriesController(ICategoryRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> Get()
    {
        return Ok(await _repo.GetAllAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Category>> Create(CategoryDto dto)
    {
        var category = new Category(dto.Name, dto.Icon, dto.Color);
        await _repo.AddAsync(category);
        return CreatedAtAction(nameof(Get), new { id = category.Id }, category);
    }
}

public record CategoryDto(string Name, string Icon, string Color);
