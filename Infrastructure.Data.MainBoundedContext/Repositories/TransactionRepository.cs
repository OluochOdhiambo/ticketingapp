using Domain.MainBoundedContext.Payments;
using Domain.MainBoundedContext.Transactions;
using Infrastructure.Crosscutting.Framework.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.MainBoundedContext.Repositories
{
    internal sealed class TransactionRepository
        : EfRepository<Transaction>, ITransactionRepository
    {
        public TransactionRepository(MainDbContext context)
            : base(context)
        {
        }

        public async Task<PagedResult<Transaction>> GetPagedTransactionsAsync(int pageNumber, int pageSize)
        {
            if (pageNumber <= 0)
                throw new ArgumentException("Page number must be greater than 0.");

            if (pageSize <= 0)
                throw new ArgumentException("Page size must be greater than 0.");

            var query = Set.AsQueryable();

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(o => o.CreatedDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Transaction>(items, totalCount, pageNumber, pageSize);
        }
    }
}
