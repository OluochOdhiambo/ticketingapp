using Application.MainBoundedContext.Commands;
using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;
using Contracts.Protos;
using Grpc.Core;

namespace Distirbuted.MainBoundedContext.Grpc.Services
{
    public class TransactionGrpcService
        : TransactionService.TransactionServiceBase
    {
        private readonly ICommandHandler<InitiatePaymentCommand, TransactionDTO> _initiatePaymentCommandHandler;

        public TransactionGrpcService(
            ICommandHandler<InitiatePaymentCommand, TransactionDTO> initiatePaymentCommandHandler) 
        { 
            _initiatePaymentCommandHandler = initiatePaymentCommandHandler;
        }

        public override async Task<InitiatePaymentResponse> InitiatePayment(
            InitiatePaymentRequest request,
            ServerCallContext context)
        {
            var command = new InitiatePaymentCommand
            {
                OrderId = Guid.Parse(request.OrderId),
                PaymentMethod = (byte)request.PaymentMethod
            };

            var transaction = await _initiatePaymentCommandHandler.HandleAsync(command, context.CancellationToken);

            var response = new InitiatePaymentResponse
            {
                Transaction = new TransactionModel
                {
                    Id = transaction.Id.ToString(),
                    OrderId = transaction.OrderId.ToString(),
                    PaymentMethod = transaction.PaymentMethodDescription,
                    Amount = (double)transaction.Amount,
                    TransactionDate = transaction.CreatedDate.ToString("O")
                }
            };

            return response;
        }
    }
}
