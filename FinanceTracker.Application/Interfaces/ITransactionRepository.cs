using FinanceTracker.Application.Common;
using FinanceTracker.Domain.Entities;

namespace FinanceTracker.Application.Interfaces;

public interface ITransactionRepository
{
    Task<PagedResult<Transaction>> GetAllAsync(TransactionQuery query);
    Task<Transaction?> GetByIdAsync(int id);
    Task AddAsync(Transaction transaction);
    Task UpdateAsync(Transaction transaction);
    Task DeleteAsync(int id);
    Task<IEnumerable<Transaction>> GetAnalyticsAsync(DateTime start, DateTime end);
}

public record TransactionQuery(
    int Page = 1, 
    int PageSize = 10, 
    string Search = "", 
    string SortBy = "Date", 
    TransactionType? Type = null, 
    int? CategoryId = null,
    string Order = "desc",
    DateTime? StartDate = null,
    DateTime? EndDate = null
    );
