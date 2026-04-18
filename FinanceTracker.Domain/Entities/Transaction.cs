namespace FinanceTracker.Domain.Entities;

public class Transaction
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public TransactionType Type { get; set; }
    
    public int CategoryId { get; set; }
    public Category Category { get; set; }

    public Transaction() { }

    public Transaction(string title, string description, decimal amount, DateTime date, TransactionType type, int categoryId)
    {
        Title = title;
        Description = description;
        Amount = amount;
        Date = date;
        Type = type;
        CategoryId = categoryId;
    }

    public void Update(string title, string description, decimal amount, DateTime date, TransactionType type, int categoryId)
    {
        Title = title;
        Description = description;
        Amount = amount;
        Date = date;
        Type = type;
        CategoryId = categoryId;
    }
}
