using Application.MainBoundedContext.Queries;
using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;
using Domain.MainBoundedContext.Transactions;
using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Application.MainBoundedContext.Handlers
{
    public sealed class GetTransactionByIdQueryHandler
        : IQueryHandler<GetTransactionByIdQuery, TransactionDTO?>
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUnitOfWork _unitOfWork;

        public GetTransactionByIdQueryHandler(
            ITransactionRepository transactionRepository,
            IUnitOfWork unitOfWork)
        {
            _transactionRepository = transactionRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<TransactionDTO?> HandleAsync(GetTransactionByIdQuery query, CancellationToken cancellationToken)
        {
            var transaction = await _transactionRepository.GetByIdAsync(query.TransactionId);

            if (transaction == null)
            {
                throw new ArgumentException($"Transaction with id {query.TransactionId} does not exist.");
            }

            return new TransactionDTO
            {
                Id = transaction.Id,
                OrderId = transaction.OrderId,
                PaymentMethod = (byte)transaction.PaymentMethod,
                PaymentMethodDescription = transaction.PaymentMethod.GetDescription(),
                TransactionReference = transaction.TransactionReference,
                Amount = transaction.TransactionAmount,
                Status = (byte)transaction.Status,
                StatusDescription = transaction.Status.GetDescription(),
                CreatedDate = transaction.CreatedDate
            };
        }
    }
}
