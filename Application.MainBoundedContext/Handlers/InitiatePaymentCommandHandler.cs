using Application.MainBoundedContext.Commands;
using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;
using Domain.MainBoundedContext.Accounts;
using Domain.MainBoundedContext.Orders;
using Domain.MainBoundedContext.Transactions;
using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace Application.MainBoundedContext.Handlers
{
    public sealed class InitiatePaymentCommandHandler
        : ICommandHandler<InitiatePaymentCommand, TransactionDTO>
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IJournalRepository _journalRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public InitiatePaymentCommandHandler(
            IAccountRepository accountRepository,
            IJournalRepository journalRepository,
            IOrderRepository orderRepository,
            ITransactionRepository transactionRepository,
            IUnitOfWork unitOfWork,
            IServiceScopeFactory serviceScopeFactory)
        {
            _accountRepository = accountRepository;
            _journalRepository = journalRepository;
            _orderRepository = orderRepository;
            _transactionRepository = transactionRepository;
            _unitOfWork = unitOfWork;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task<TransactionDTO> HandleAsync(
            InitiatePaymentCommand command,
            CancellationToken cancellationToken)
        {
            var order = await _orderRepository
                .GetOrderWithLinesByIdAsync(command.OrderId);

            if (order == null)
            {
                throw new ArgumentException(
                    $"Order with id {command.OrderId} does not exist.");
            }

            order.MarkAsPaid();

            var transaction = TransactionFactory.CreateTransaction(
                order.Id,
                command.PaymentMethod,
                "Payment for order " + order.Id,
                order.GetTotal());

            _transactionRepository.Add(transaction);

            await _unitOfWork.CommitAsync(cancellationToken);

            var dto = new TransactionDTO
            {
                Id = transaction.Id,
                OrderId = transaction.OrderId,
                PaymentMethod = (byte)transaction.PaymentMethod,
                PaymentMethodDescription =
                    transaction.PaymentMethod.GetDescription(),
                TransactionReference =
                    transaction.TransactionReference,
                Amount = transaction.TransactionAmount,
                CreatedDate = transaction.CreatedDate
            };

            switch ((PaymentMethod)command.PaymentMethod)
            {
                case PaymentMethod.CreditCard:

                    await ConfirmTransactionAsync(
                        transaction.Id,
                        cancellationToken);

                    dto.StatusDescription =
                        transaction.Status.GetDescription();

                    break;

                case PaymentMethod.QRCodeScan:

                    dto.StatusDescription =
                        transaction.Status.GetDescription();

                    _ = Task.Run(async () =>
                    {
                        await Task.Delay(
                            TimeSpan.FromSeconds(8),
                            CancellationToken.None);

                        using var scope =
                            _serviceScopeFactory.CreateScope();

                        var transactionRepository =
                            scope.ServiceProvider
                                .GetRequiredService<ITransactionRepository>();

                        var accountRepository =
                            scope.ServiceProvider
                                .GetRequiredService<IAccountRepository>();

                        var journalRepository =
                            scope.ServiceProvider
                                .GetRequiredService<IJournalRepository>();

                        var unitOfWork =
                            scope.ServiceProvider
                                .GetRequiredService<IUnitOfWork>();

                        await ConfirmTransactionAsync(
                            transaction.Id,
                            transactionRepository,
                            accountRepository,
                            journalRepository,
                            unitOfWork,
                            CancellationToken.None);
                    });

                    break;
            }

            return dto;
        }

        private async Task ConfirmTransactionAsync(
            Guid transactionId,
            CancellationToken cancellationToken)
        {
            await ConfirmTransactionAsync(
                transactionId,
                _transactionRepository,
                _accountRepository,
                _journalRepository,
                _unitOfWork,
                cancellationToken);
        }

        private static async Task ConfirmTransactionAsync(
            Guid transactionId,
            ITransactionRepository transactionRepository,
            IAccountRepository accountRepository,
            IJournalRepository journalRepository,
            IUnitOfWork unitOfWork,
            CancellationToken cancellationToken)
        {
            var transaction =
                await transactionRepository.GetByIdAsync(transactionId);

            if (transaction == null)
            {
                return;
            }

            transaction.Confirm();

            var journal = JournalFactory.CreateNewJournal(
                $"Journal for transaction: {transactionId}",
                "_SYS_");

            var creditAccount =
                await accountRepository.GetAccountByCodeAsync("4100");

            var debitAccount =
                await accountRepository.GetAccountByCodeAsync("1100");

            if (creditAccount == null)
            {
                throw new ArgumentException(
                    "Account with code 4100 not configured.");
            }

            if (debitAccount == null)
            {
                throw new ArgumentException(
                    "Account with code 1100 not configured.");
            }

            journal.AddEntry(
                creditAccount,
                0,
                transaction.TransactionAmount,
                "_SYS_");

            journal.AddEntry(
                debitAccount,
                transaction.TransactionAmount,
                0,
                "_SYS_");

            journalRepository.Add(journal);

            await unitOfWork.CommitAsync(cancellationToken);
        }
    }
}