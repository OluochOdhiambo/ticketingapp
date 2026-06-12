using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;

namespace Application.MainBoundedContext.Queries
{
    public class GetTransactionByIdQuery
        : IQuery<TransactionDTO?>
    {
        public Guid TransactionId { get; set; }

        public GetTransactionByIdQuery (Guid transactionId)
        {
            TransactionId = transactionId;
        }
    }
}
