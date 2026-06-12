using Application.Contracts.Services;
using Application.Shared.Application.OrdersModule;
using Application.Shared.Application.Shared;
using Contracts.Protos;
using Grpc.Core;

namespace Application.Infrastructure.Gateway
{
    public class OrderGatewayService : IOrderGatewayService
    {
        private readonly OrderService.OrderServiceClient _client;

        public OrderGatewayService(
            OrderService.OrderServiceClient client)
        {
            _client = client;
        }

        public async Task<OrderDTO> BookTicketAsync(BookTicketDTO dto)
        {
            try
            {
                var response = await _client.BookTicketAsync(
                    new BookTicketRequest
                    {
                        CustomerId = dto.CustomerId.ToString(),
                        OrderLine = new CreateOrderItemModel
                        {
                            TicketId = dto.Line.TicketId.ToString(),
                            OrderedQuantity = dto.Line.Quantity,
                        }
                    });

                var orderDTO =  new OrderDTO
                {
                    Id = Guid.Parse(response.Order.Id),
                    CustomerId = Guid.Parse(response.Order.CustomerId),
                    Status = response.Order.Status,
                    TotalAmount = (decimal)response.Order.TotalPrice
                };

                if (response.Order.Items?.Any() == true)
                {
                    orderDTO.OrderLines.AddRange(response.Order.Items.Select(i => new OrderLineDTO
                    {
                        Id = Guid.Parse(i.Id),
                        OrderId = Guid.Parse(i.OrderId),
                        TicketId = Guid.Parse(i.TicketId),
                        Quantity = i.OrderedQuantity,
                        CurrencyCode = i.CurrencyCode,
                        UnitPrice = (decimal)i.UnitPrice,
                        LineTotal = (decimal)i.LineTotal
                    }));
                }

                return orderDTO;
            }
            catch (RpcException ex)
            {
                throw;
            }
        }

        public async Task<OrderDTO> AddOrderLineAsync(AddOrderLineDTO dto)
        {
            try
            {
                var response = await _client.AddOrderLineAsync(
                    new AddOrderLineRequest
                    {
                        OrderId = dto.OrderId.ToString(),
                        OrderLine = new CreateOrderItemModel
                        {
                            TicketId = dto.TicketId.ToString(),
                            OrderedQuantity = dto.Quantity,
                        }
                    });

                var orderDTO = new OrderDTO
                {
                    Id = Guid.Parse(response.Order.Id),
                    CustomerId = Guid.Parse(response.Order.CustomerId),
                    Status = response.Order.Status,
                    TotalAmount = (decimal)response.Order.TotalPrice
                };

                if (response.Order.Items?.Any() == true)
                {
                    orderDTO.OrderLines.AddRange(response.Order.Items.Select(i => new OrderLineDTO
                    {
                        Id = Guid.Parse(i.Id),
                        OrderId = Guid.Parse(i.OrderId),
                        TicketId = Guid.Parse(i.TicketId),
                        Quantity = i.OrderedQuantity,
                        CurrencyCode = i.CurrencyCode,
                        UnitPrice = (decimal)i.UnitPrice,
                        LineTotal = (decimal)i.LineTotal
                    }));
                }

                return orderDTO;
            }
            catch (RpcException ex)
            {
                throw;
            }
        }

        public async Task<OrderDTO> RemoveOrderLineAsync(AddOrderLineDTO dto)
        {
            try
            {
                var response = await _client.RemoveOrderLineAsync(
                    new RemoveOrderLineRequest
                    {
                        OrderId = dto.OrderId.ToString(),
                        OrderLine = new CreateOrderItemModel
                        {
                            TicketId = dto.TicketId.ToString(),
                            OrderedQuantity = dto.Quantity,
                        }
                    });

                var orderDTO = new OrderDTO
                {
                    Id = Guid.Parse(response.Order.Id),
                    CustomerId = Guid.Parse(response.Order.CustomerId),
                    Status = response.Order.Status,
                    TotalAmount = (decimal)response.Order.TotalPrice
                };

                if (response.Order.Items?.Any() == true)
                {
                    orderDTO.OrderLines.AddRange(response.Order.Items.Select(i => new OrderLineDTO
                    {
                        Id = Guid.Parse(i.Id),
                        OrderId = Guid.Parse(i.OrderId),
                        TicketId = Guid.Parse(i.TicketId),
                        Quantity = i.OrderedQuantity,
                        CurrencyCode = i.CurrencyCode,
                        UnitPrice = (decimal)i.UnitPrice,
                        LineTotal = (decimal)i.LineTotal
                    }));
                }

                return orderDTO;
            }
            catch (RpcException ex)
            {
                throw;
            }
        }
    }
}
