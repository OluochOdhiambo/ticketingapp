using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Models;

namespace Domain.MainBoundedContext.Tickets
{
    public interface ITicketRepository : IRepository<Ticket>
    {
        Task<PagedResult<Ticket>> GetPagedTicketsAsync(int pageNumber, int pageSize);
    }
}
