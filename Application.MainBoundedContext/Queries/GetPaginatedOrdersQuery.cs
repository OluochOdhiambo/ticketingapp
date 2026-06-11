using Application.MainBoundedContextDTO.Orders;
using Application.Seedwork;
using Infrastructure.Crosscutting.Framework.Models;

namespace Application.MainBoundedContext.Queries
{
    public class GetPaginatedOrdersQuery
        : IQuery<PagedResult<OrderDTO>>
    {
    }
}
