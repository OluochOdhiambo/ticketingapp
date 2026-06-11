using Domain.MainBoundedContext.Orders;
using Infrastructure.Crosscutting.Framework.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.MainBoundedContext.Repositories
{
    internal sealed class OrderRepository
        : EfRepository<Order>, IOrderRepository
    {
        public OrderRepository(MainDbContext context)
            : base(context)
        {
        }

        public async Task<Order?> GetOrderWithLinesByIdAsync(Guid id)
        {
            return await Set
                .Include(o => o.Lines)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<PagedResult<Order>> GetPagedOrdersAsync(int pageNumber, int pageSize)
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

            return new PagedResult<Order>(items, totalCount, pageNumber, pageSize);
        }
    }
}
