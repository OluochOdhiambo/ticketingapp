using Application.MainBoundedContext.Commands;
using Application.MainBoundedContextDTO.Orders;
using Application.Seedwork;
using Contracts.Protos;
using Grpc.Core;

namespace Distirbuted.MainBoundedContext.Grpc.Services
{
    public class OrderGrpcService
        : OrderService.OrderServiceBase
    {
        private readonly ICommandHandler<AddOrderLineCommand, OrderDTO> _addOrderLineCommandHandler;
        private readonly ICommandHandler<BookTicketCommand, OrderDTO> _bookTicketCommandHandler;

        public OrderGrpcService(
            ICommandHandler<BookTicketCommand, OrderDTO> bookTicketCommandHandler,
            ICommandHandler<AddOrderLineCommand, OrderDTO> addOrderLineCommandHandler)
        {
            _addOrderLineCommandHandler = addOrderLineCommandHandler;
            _bookTicketCommandHandler = bookTicketCommandHandler;
        }

        public override async Task<BookTicketResponse> BookTicket(
            BookTicketRequest request, 
            ServerCallContext context) 
        { 
            var command = new BookTicketCommand
            {
                CustomerId = Guid.Parse(request.CustomerId),
                Line = new OrderLineDTO
                {
                    TicketId = Guid.Parse(request.OrderLine.TicketId),
                    Quantity = request.OrderLine.OrderedQuantity
                }
            };

            var order = await _bookTicketCommandHandler.HandleAsync(command, context.CancellationToken);

            var response = new BookTicketResponse
            {
                Order = new OrderModel
                {
                    Id = order.Id.ToString(),
                    CustomerId = order.CustomerId.ToString(),
                    TotalPrice = (double)order.TotalAmount,
                    Status = order.StatusDescription,

                    Items = { order.OrderLines.Select(line => new OrderItemModel
                    {
                        Id = line.Id.ToString(),
                        OrderId = line.OrderId.ToString(),
                        TicketId = line.TicketId.ToString(),
                        OrderedQuantity = line.Quantity,
                        CurrencyCode = line.CurrencyCode,
                        UnitPrice = (double)line.UnitPrice,
                        LineTotal = (double)line.LineTotal
                    }) }
                }
            };

            return response;
        }

        public override async Task<AddOrderLineResponse> AddOrderLine(
            AddOrderLineRequest request, 
            ServerCallContext context) 
        { 
            var command = new AddOrderLineCommand
            {
                OrderId = Guid.Parse(request.OrderId),
                Line = new OrderLineDTO
                {
                    TicketId = Guid.Parse(request.OrderLine.TicketId),
                    Quantity = request.OrderLine.OrderedQuantity
                }
            };

            var order = await _addOrderLineCommandHandler.HandleAsync(command, context.CancellationToken);

            var response = new AddOrderLineResponse
            {
                Order = new OrderModel
                {
                    Id = order.Id.ToString(),
                    CustomerId = order.CustomerId.ToString(),
                    TotalPrice = (double)order.TotalAmount,
                    Status = order.StatusDescription,

                    Items = { order.OrderLines.Select(line => new OrderItemModel
                    {
                        Id = line.Id.ToString(),
                        OrderId = line.OrderId.ToString(),
                        TicketId = line.TicketId.ToString(),
                        OrderedQuantity = line.Quantity,
                        CurrencyCode = line.CurrencyCode,
                        UnitPrice = (double)line.UnitPrice,
                        LineTotal = (double)line.LineTotal
                    }) }
                }
            };

            return response;
        }
    }
}
