using Application.MainBoundedContextDTO.Orders;
using Application.Seedwork;

namespace Application.MainBoundedContext.Commands
{
    public class RemoveOrderLineCommand : ICommand<OrderDTO>
    {
        public Guid OrderId { get; set; }

        public OrderLineDTO Line { get; init; } = new();
    }
}
