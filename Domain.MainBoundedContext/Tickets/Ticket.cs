using Domain.MainBoundedContext.ValueObjects;
using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Domain.MainBoundedContext.Tickets
{
    public class Ticket : AggregateRoot
    {
        private Ticket()
        {
        }

        public Ticket(
            TicketType ticketType,
            int quantity,
            Money price)
        {
            TicketType = ticketType;
            QuantityOnHand = quantity;
            Price = price;
        }

        public TicketType TicketType { get; private set; }

        public int QuantityOnHand { get; private set; }

        public int QuantityReserved { get; private set; }

        public Money Price { get; private set; }

        public decimal AvailableToSell
            => QuantityOnHand - QuantityReserved;


        public void Reserve(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException(
                    "Quantity must be greater than zero.");

            if (AvailableToSell < quantity)
                throw new InvalidOperationException(
                    "Insufficient ticket quantity available.");

            QuantityReserved += quantity;
            QuantityOnHand -= quantity;
        }

        public void ReleaseReservation(int quantity)
        {
            QuantityReserved -= quantity;
            QuantityOnHand += quantity;

            if (QuantityReserved < 0)
                QuantityReserved = 0;
        }

        public void Receive(int quantity)
        {
            QuantityOnHand += quantity;
        }

        public void Sell(int quantity)
        {
            if (QuantityReserved < quantity)
                throw new InvalidOperationException(
                    "Insufficient reserved quantity.");

            QuantityReserved -= quantity;
        }
    }
}