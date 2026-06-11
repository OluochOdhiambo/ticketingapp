using Domain.MainBoundedContext.Orders;
using Domain.MainBoundedContext.ValueObjects;
using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Domain.MainBoundedContext.Payments
{
    public class Transaction : AggregateRoot
    {
        private Transaction() { }

        internal Transaction(Guid orderId, byte paymentMethod, string transactionReference, decimal transactionAmount)
        {
            OrderId = orderId;
            PaymentMethod = (PaymentMethod)paymentMethod;
            TransactionReference = transactionReference;
            TransactionAmount = transactionAmount;
            Status = TransactionStatus.Pending;
            CreatedDate = DateTime.UtcNow;

            GenerateNewIdentity();
        }

        public Guid OrderId { get; private set; }

        public virtual Order Order { get; private set; }

        public PaymentMethod PaymentMethod { get; private set; }

        public string TransactionReference { get; private set; } = null!;

        public decimal TransactionAmount { get; private set; }

        public TransactionStatus Status { get; private set; }

        public void Confirm()
        {
            if (Status != TransactionStatus.Pending)
            {
                throw new ArgumentException(
                    "Only pending transactions can be confirmed.");
            }

            Status = TransactionStatus.Confirmed;
        }
    }
}
