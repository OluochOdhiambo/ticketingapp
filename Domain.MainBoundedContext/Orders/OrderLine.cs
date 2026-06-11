using Domain.MainBoundedContext.ValueObjects;
using Domain.Seedwork;

namespace Domain.MainBoundedContext.Orders
{
    public class OrderLine : Entity
    {
        private OrderLine()
        {
        }

        internal OrderLine(
            Guid orderId,
            Guid ticketId,
            int quantity,
            Money unitPrice)
        {
            OrderId = orderId;
            TicketId = ticketId;
            OrderedQuantity = quantity;
            UnitPrice = unitPrice;
        }

        public Guid OrderId { get; private set; }

        public Guid TicketId { get; private set; }

        public int OrderedQuantity { get; private set; }

        public Money UnitPrice { get; private set; }

        public Money GetLineTotal()
            => new(
                UnitPrice.Amount * OrderedQuantity,
                UnitPrice.Currency);

        public void IncreaseQuantity(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException(
                    "Quantity must be greater than zero.");

            OrderedQuantity += quantity;
        }

        public void DecreaseQuantity(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException(
                    "Quantity must be greater than zero.");

            if (quantity > OrderedQuantity)
                throw new InvalidOperationException(
                    "Cannot reduce quantity below zero.");

            OrderedQuantity -= quantity;
        }
    }
}