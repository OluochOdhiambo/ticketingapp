using Domain.MainBoundedContext.Accounts;
using Infrastructure.Crosscutting.Framework.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.MainBoundedContext.Repositories
{
    internal sealed class JournalRepository
        : EfRepository<Journal>, IJournalRepository
    {
        public JournalRepository(MainDbContext context)
            : base(context)
        {
        }

        public async Task<Journal?> GetJournalWithEntriesByIdAsync(Guid id)
        {
            return await Set
                .Include(je => je.Entries)
                .FirstOrDefaultAsync(je => je.Id == id);
        }

        public async Task<PagedResult<Journal>> GetPagedJournalsAsync(int pageNumber, int pageSize)
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

            return new PagedResult<Journal>(items, totalCount, pageNumber, pageSize);
        }
    }
}
