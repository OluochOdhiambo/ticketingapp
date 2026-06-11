using Domain.MainBoundedContext.Accounts;
using Infrastructure.Crosscutting.Framework.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.MainBoundedContext.Repositories
{
    internal sealed class AccountRepository
        : EfRepository<Account>, IAccountRepository
    {
        public AccountRepository(MainDbContext context)
            : base(context)
        {
        }

        public Task<Account?> GetAccountByCodeAsync(string accountCode)
        {
            return Set
                .FirstOrDefaultAsync(a => a.Code == accountCode);
        }

        public async Task<PagedResult<Account>> GetPagedAccountsAsync(int pageNumber, int pageSize)
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

            return new PagedResult<Account>(items, totalCount, pageNumber, pageSize);
        }
    }
}
