using Application.Shared.Application.OrdersModule;
using Application.Shared.Application.TransactionsModule;

namespace Application.Contracts.Services
{
    public interface ITransactionGatewayService
    {
        Task<TransactionDTO> InitiatePaymentAsync(InitiatePaymentDTO dto);

        Task<TransactionDTO?> GetTransactionAsync(Guid transactionId);
    }
}
