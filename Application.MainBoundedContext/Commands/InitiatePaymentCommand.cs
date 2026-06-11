using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;

namespace Application.MainBoundedContext.Commands
{
    public sealed class InitiatePaymentCommand
        : ICommand<TransactionDTO>
    {
        public Guid OrderId { get; set; }

        public byte PaymentMethod { get; set; }
    }
}
