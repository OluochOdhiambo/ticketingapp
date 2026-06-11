using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Shared.Application.TransactionsModule
{
    public class TransactionDTO
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }

        public string PaymentMethod { get; set; } = string.Empty;

        public string TransactionReference { get; set; } = null!;

        public decimal Amount { get; set; }

        public byte Status { get; set; }

        public DateTime TransactionDate { get; set; }
    }
}
