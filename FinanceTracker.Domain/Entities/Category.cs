namespace FinanceTracker.Domain.Entities;

public enum TransactionType
{
    Income,
    Expense
}

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Icon { get; set; }
    
    public TransactionType Type { get; set; } 

    public Category() { }

    public Category(string name, string icon, string color)
    {
        Name = name;
        Icon = icon;
    }

    public void Update(string name, string icon, string color)
    {
        Name = name;
        Icon = icon;
    }
}
