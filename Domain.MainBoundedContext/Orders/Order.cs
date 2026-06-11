using Domain.MainBoundedContext.Customers;
using Domain.MainBoundedContext.Tickets;
using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Domain.MainBoundedContext.Orders
{
    public class Order : AggregateRoot
    {
        private readonly List<OrderLine> _lines = new();

        private Order()
        {
        }

        internal Order(Guid customerId)
        {
            CustomerId = customerId;
            Status = OrderStatus.Draft;
            CreatedDate = DateTime.UtcNow;

            GenerateNewIdentity();
        }

        public Guid CustomerId { get; private set; }

        public virtual Customer Customer { get; private set; }

        public OrderStatus Status { get; private set; }

        public IReadOnlyCollection<OrderLine> Lines
            => _lines.AsReadOnly();

        public decimal GetTotal()
        {
            return _lines.Sum(x => x.GetLineTotal().Amount);
        }

        public void AddLine(Ticket ticket, int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException(
                    "Quantity must be greater than zero.");

            var existingLine = _lines
                .FirstOrDefault(x => x.TicketId == ticket.Id);

            ticket.Reserve(quantity);

            if (existingLine != null)
            {
                existingLine.IncreaseQuantity(quantity);
                return;
            }

            _lines.Add(
                new OrderLine(
                    Id,
                    ticket.Id,
                    quantity,
                    ticket.Price));
        }

        public void RemoveLine(Ticket ticket, int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException(
                    "Quantity must be greater than zero.");

            var existingLine = _lines
                .FirstOrDefault(x => x.TicketId == ticket.Id);

            if (existingLine == null)
                throw new InvalidOperationException(
                    "The ticket does not exist in the order.");

            existingLine.DecreaseQuantity(quantity);

            ticket.ReleaseReservation(quantity);

            if (existingLine.OrderedQuantity == 0)
            {
                _lines.Remove(existingLine);
            }
        }

        public void Book()
        {
            if (!_lines.Any())
                throw new InvalidOperationException(
                    "Order must contain at least one line.");

            Status = OrderStatus.Booked;
        }

        public void Refund()
        {
            Status = OrderStatus.Refunded;
        }

    }
}