using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Shared.Application.TransactionsModule
{
    public class InitiatePaymentDTO
    {
        public Guid OrderId { get; set; }

        public byte PaymentMethod { get; set; }
    }
}
