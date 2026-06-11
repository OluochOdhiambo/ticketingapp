using Application.MainBoundedContext.Commands;
using Application.MainBoundedContextDTO.Orders;
using Application.Seedwork;
using Domain.MainBoundedContext.Orders;
using Domain.MainBoundedContext.Tickets;
using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Application.MainBoundedContext.Handlers
{
    public sealed class BookTicketCommandHandler
        : ICommandHandler<BookTicketCommand, OrderDTO>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly IUnitOfWork _unitOfWork;

        public BookTicketCommandHandler(
            IOrderRepository orderRepository,
            ITicketRepository ticketRepository,
            IUnitOfWork unitOfWork) 
        {
            _orderRepository = orderRepository;
            _ticketRepository = ticketRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<OrderDTO> HandleAsync(
            BookTicketCommand command, 
            CancellationToken cancellationToken)
        {
            var order = OrderFactory.Create(command.CustomerId);

            var ticket = await _ticketRepository.GetByIdAsync(command.Line.TicketId);

            if (ticket == null)
            {
                throw new ArgumentException($"Ticket with id {command.Line.TicketId} does not exist.");
            }

            order.AddLine(ticket, command.Line.Quantity);

            _orderRepository.Add(order);

            await _unitOfWork.CommitAsync(cancellationToken);

            return new OrderDTO
            {
                Id = order.Id,
                CustomerId = order.CustomerId,
                Status = (byte)order.Status,
                StatusDescription = order.Status.GetDescription(),
                TotalAmount = order.GetTotal(),
                OrderLines = order.Lines.Select(l => new OrderLineDTO
                {
                    Id = l.Id,
                    OrderId = order.Id,
                    TicketId = l.TicketId,
                    Quantity = l.OrderedQuantity,
                    CurrencyCode = l.UnitPrice.Currency,
                    UnitPrice = l.UnitPrice.Amount
                }).ToList()
            };
        }
    }
}
