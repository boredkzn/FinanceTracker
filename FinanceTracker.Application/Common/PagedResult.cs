namespace FinanceTracker.Application.Common;

public class PagedResult<T>
{
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public List<T> Data { get; set; } = new();

    public PagedResult() { }

    public PagedResult(int total, int page, int pageSize, List<T> data)
    {
        Total = total;
        Page = page;
        PageSize = pageSize;
        Data = data;
    }
}