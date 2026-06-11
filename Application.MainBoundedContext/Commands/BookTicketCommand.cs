using Application.MainBoundedContextDTO.Orders;
using Application.Seedwork;

namespace Application.MainBoundedContext.Commands
{
    public sealed class BookTicketCommand
        : ICommand<OrderDTO>
    {
        public Guid CustomerId { get; set; }

        public OrderLineDTO Line { get; init; } = new();
    }
}
