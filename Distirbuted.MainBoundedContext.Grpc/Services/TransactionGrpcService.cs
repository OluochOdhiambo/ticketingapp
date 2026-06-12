using Application.MainBoundedContext.Commands;
using Application.MainBoundedContext.Queries;
using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;
using Contracts.Protos;
using Grpc.Core;

namespace Distirbuted.MainBoundedContext.Grpc.Services
{
    public class TransactionGrpcService
        : TransactionService.TransactionServiceBase
    {
        private readonly IQueryHandler<GetTransactionByIdQuery, TransactionDTO?> _getTransactionByIdQueryHandler;
        private readonly ICommandHandler<InitiatePaymentCommand, TransactionDTO> _initiatePaymentCommandHandler;

        public TransactionGrpcService(
IQueryHandler<GetTransactionByIdQuery, TransactionDTO?> getTransactionByIdQueryHandler,
ICommandHandler<InitiatePaymentCommand, TransactionDTO> initiatePaymentCommandHandler) 
        {
            _getTransactionByIdQueryHandler = getTransactionByIdQueryHandler;
            _initiatePaymentCommandHandler = initiatePaymentCommandHandler;
        }

        public override async Task<GetTransactionResponse> GetTransaction(
            GetTransactionRequest request,
            ServerCallContext context)
        {
            var query = new GetTransactionByIdQuery(Guid.Parse(request.TransactionId));

            var result = await _getTransactionByIdQueryHandler.HandleAsync(query, context.CancellationToken);

            if (result is null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, "Customer not found"));
            }

            return new GetTransactionResponse
            {
                Transaction = new TransactionModel
                {
                    Id = result.Id.ToString(),
                    OrderId = result.OrderId.ToString(),
                    PaymentMethod = result.PaymentMethodDescription,
                    Amount = (double)result.Amount,
                    TransactionReference = result.TransactionReference,
                    TransactionDate = result.CreatedDate.ToString("o")
                }
            };
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
