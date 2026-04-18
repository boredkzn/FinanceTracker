using Microsoft.EntityFrameworkCore;
using FinanceTracker.Domain.Entities;

namespace FinanceTracker.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Category> Categories => Set<Category>();

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Зарплата", Icon = "💰" },
            new Category { Id = 2, Name = "Фриланс", Icon = "💻" },
            new Category { Id = 3, Name = "Продукты", Icon = "🛒" },
            new Category { Id = 4, Name = "Транспорт", Icon = "🚌" },
            new Category { Id = 5, Name = "Развлечения", Icon = "🎬" },
            new Category { Id = 6, Name = "Здоровье", Icon = "💊" },
            new Category { Id = 7, Name = "Дом", Icon = "🏠" }
        );
    }
}