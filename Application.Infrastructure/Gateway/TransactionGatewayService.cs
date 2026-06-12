using Application.Contracts.Services;
using Application.Shared.Application.TransactionsModule;
using Contracts.Protos;
using Grpc.Core;

namespace Application.Infrastructure.Gateway
{
    public class TransactionGatewayService : ITransactionGatewayService
    {
        private readonly TransactionService.TransactionServiceClient _client;

        public TransactionGatewayService(
            TransactionService.TransactionServiceClient client)
        {
            _client = client;
        }

        public async Task<TransactionDTO?> GetTransactionAsync(Guid transactionId)
        {
            try
            {
                var response = await _client.GetTransactionAsync(
                    new GetTransactionRequest
                    {
                        TransactionId = transactionId.ToString(),
                    });

                var transactionDTO = new TransactionDTO
                {
                    Id = Guid.Parse(response.Transaction.Id),
                    OrderId = Guid.Parse(response.Transaction.OrderId),
                    PaymentMethod = response.Transaction.PaymentMethod,
                    TransactionReference = response.Transaction.TransactionReference,
                    TransactionDate = Convert.ToDateTime(response.Transaction.TransactionDate)
                };

                return transactionDTO;
            }
            catch (RpcException ex)
            {
                throw;
            }
        }

        public async Task<TransactionDTO> InitiatePaymentAsync(InitiatePaymentDTO dto)
        {
            try
            {
                var response = await _client.InitiatePaymentAsync(
                    new InitiatePaymentRequest
                    {
                        OrderId = dto.OrderId.ToString(),
                        PaymentMethod = dto.PaymentMethod
                    });

                var transactionDTO = new TransactionDTO
                {
                    Id = Guid.Parse(response.Transaction.Id),
                    OrderId = Guid.Parse(response.Transaction.OrderId),
                    PaymentMethod = response.Transaction.PaymentMethod,
                    TransactionReference = response.Transaction.TransactionReference,
                    TransactionDate = Convert.ToDateTime(response.Transaction.TransactionDate)
                };

                return transactionDTO;
            }
            catch (RpcException ex)
            {
                throw;
            }
        }
    }
}
