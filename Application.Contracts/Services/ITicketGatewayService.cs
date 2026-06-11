using Application.Shared.Application.Shared;
using Application.Shared.Application.TicketsModule;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Contracts.Services
{
    public interface ITicketGatewayService
    {
        Task<PagedSet<TicketDTO>> GetTicketsAsync(PagedRequest request); 
    }
}
