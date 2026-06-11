using Domain.MainBoundedContext.Payments;
using Domain.MainBoundedContext.ValueObjects;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Domain.MainBoundedContext.Transactions
{
    public static class TransactionFactory
    {
        public static Transaction CreateTransaction(Guid orderId, byte paymentMethod, string transactionReference, decimal amount)
        {
            return new Transaction(orderId, paymentMethod, transactionReference, amount);
        }
    }
}
