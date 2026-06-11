using Application.Contracts.Services;
using Application.Shared.Application.Shared;
using Application.Shared.Application.TicketsModule;
using Contracts.Grpc;
using Grpc.Core;

namespace Application.Infrastructure.Gateway
{
    public class TicketGatewayService : ITicketGatewayService
    {
        private readonly TicketService.TicketServiceClient _client;

        public TicketGatewayService(
            TicketService.TicketServiceClient client)
        {
            _client = client;
        }

        public async Task<PagedSet<TicketDTO>> GetTicketsAsync(PagedRequest request)
        {
            try
            {
                var response = await _client.GetTicketsAsync(
                    new GetPaginatedTicketsRequest
                    {
                        PageNumber = request.PageNumber,
                        PageSize = request.PageSize,
                    });

                var items = response.Tickets.Select(t => new TicketDTO
                {
                    Id = Guid.Parse(t.Id),
                    TicketType = t.TicketType,
                    QuantityOnHand = t.QuantityOnHand,
                    QuantityReserved = t.QuantityReserved,
                    Currency = t.PriceCurrency,
                    Amount = (decimal)t.PriceAmount
                }).ToList();

                return new PagedSet<TicketDTO>(
                    items,
                    response.TotalCount,
                    response.PageNumber,
                    response.PageSize);
            }
            catch (RpcException ex)
            {
                throw;
            }
        }
    }
}
