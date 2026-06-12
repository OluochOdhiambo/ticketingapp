using Application.Shared.Application.Shared;
using Application.Shared.Application.TicketsModule;

namespace Application.Contracts.Services
{
    public interface ITicketGatewayService
    {
        Task<PagedSet<TicketDTO>> GetTicketsAsync(PagedRequest request); 
    }
}
