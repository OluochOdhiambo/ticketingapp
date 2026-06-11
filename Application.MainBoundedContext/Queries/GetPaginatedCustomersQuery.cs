using Application.MainBoundedContextDTO.Customers;
using Application.Seedwork;
using Infrastructure.Crosscutting.Framework.Models;

namespace Application.MainBoundedContext.Queries
{
    public class GetPaginatedCustomersQuery : IQuery<PagedResult<CustomerDTO>>
    {
    }
}
