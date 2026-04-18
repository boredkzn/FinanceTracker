namespace FinanceTracker.Application.Common;

public class PaginationQuery
{
    public string? Search { get; set; }
    
    public string SortBy { get; set; } = "id";
    
    public string Order { get; set; } = "asc";
    
    public int Page { get; set; } = 1;
    
    public int PageSize { get; set; } = 5;
}