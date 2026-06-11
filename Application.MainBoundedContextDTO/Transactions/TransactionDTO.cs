using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Transactions;

namespace Application.MainBoundedContextDTO.Transactions
{
    public class TransactionDTO
    {
        public Guid Id { get; set; }

        public Guid OrderId { get; set; }

        public byte PaymentMethod { get; set; }

        public string PaymentMethodDescription { get; set; } = string.Empty;

        public string TransactionReference { get; set; } = null!;

        public decimal Amount { get; set; }

        public byte Status { get; set; }

        public string StatusDescription { get; set; } = null!;

        public DateTime CreatedDate { get; set; }
    }
}
