using Domain.MainBoundedContext.Tickets;
using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Models;

namespace Domain.MainBoundedContext.Customers
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<PagedResult<Customer>> GetPagedCustomersAsync(int pageNumber, int pageSize);
    }
}
