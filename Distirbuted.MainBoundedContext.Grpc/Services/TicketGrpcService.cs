using Application.MainBoundedContext.Queries;
using Application.MainBoundedContextDTO.Tickets;
using Application.Seedwork;
using Contracts.Grpc;
using Grpc.Core;
using Infrastructure.Crosscutting.Framework.Models;

namespace Distirbuted.MainBoundedContext.Grpc.Services
{
    public class TicketGrpcService :
        TicketService.TicketServiceBase
    {
        private readonly IQueryHandler<GetPaginatedTicketsQuery, PagedResult<TicketDTO>> _getPaginatedTicketsQueryHandler;

        public TicketGrpcService(
            IQueryHandler<GetPaginatedTicketsQuery, PagedResult<TicketDTO>> getPaginatedTicketsQueryHandler)
        {
            _getPaginatedTicketsQueryHandler = getPaginatedTicketsQueryHandler;
        }

        public override async Task<GetPaginatedTicketsResponse> GetTickets(
            GetPaginatedTicketsRequest request,
            ServerCallContext context)
        {
            var query = new GetPaginatedTicketsQuery(
                request.PageNumber,
                request.PageSize
            );

            var result = await _getPaginatedTicketsQueryHandler.HandleAsync(query, context.CancellationToken);

            if (result is null || !result.Items.Any())
            {
                return new GetPaginatedTicketsResponse
                {
                    TotalCount = 0,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }

            var response = new GetPaginatedTicketsResponse
            {
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

            response.Tickets.AddRange(result.Items.Select(t => 
            new TicketModel
            {
                Id = t.Id.ToString(),
                TicketType = t.TicketType,
                QuantityOnHand = t.QuantityOnHand,
                QuantityReserved = t.QuantityReserved,
                PriceCurrency = t.Currency,
                PriceAmount = (double)t.Amount
            }));

            return response;
        }
    }
}
