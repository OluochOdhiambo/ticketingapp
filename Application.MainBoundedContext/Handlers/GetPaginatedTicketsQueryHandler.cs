using Application.MainBoundedContext.Queries;
using Application.MainBoundedContextDTO.Tickets;
using Application.Seedwork;
using Domain.MainBoundedContext.Tickets;
using Infrastructure.Crosscutting.Framework.Models;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Application.MainBoundedContext.Handlers
{
    public class GetPaginatedTicketsQueryHandler
        : IQueryHandler<GetPaginatedTicketsQuery, PagedResult<TicketDTO>>
    {
        private readonly ITicketRepository _ticketRepository;

        public GetPaginatedTicketsQueryHandler(
            ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        public async Task<PagedResult<TicketDTO>> HandleAsync(GetPaginatedTicketsQuery query, CancellationToken cancellationToken)
        {
            var result = await _ticketRepository.GetPagedTicketsAsync(query.PageNumber, query.PageSize);

            var pagedTicketsDTOs = new PagedResult<TicketDTO>(
                items: result.Items.Select(ticket => new TicketDTO
                {
                    Id = ticket.Id,
                    TicketType = ticket.TicketType.GetDescription(),
                    QuantityOnHand = 0,
                    QuantityReserved = 0,
                    Currency = "AED",
                    Amount = ticket.Price.Amount
                }).ToList(),
                totalCount: result.TotalCount,
                pageNumber: result.PageNumber,
                pageSize: result.PageSize
                );

            return pagedTicketsDTOs;
        }
    }
}
