using Application.MainBoundedContextDTO.Customers;
using Application.Seedwork;
using Infrastructure.Crosscutting.Framework.Models;

namespace Application.MainBoundedContext.Queries
{
    public class GetPaginatedCustomersQuery : IQuery<PagedResult<CustomerDTO>>
    {
        public int PageNumber { get; }
        public int PageSize { get; }

        public GetPaginatedCustomersQuery(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
    }
}
