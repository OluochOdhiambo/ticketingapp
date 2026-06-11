using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Shared.Application.TicketsModule
{
    public class TicketDTO
    {
        public Guid Id { get; set; }

        public string TicketType { get; set; } = null!;

        public int QuantityOnHand { get; set; }

        public int QuantityReserved { get; set; }

        public int AvailableToSell { get; set; }

        public string Currency { get; set; } = null!;

        public decimal Amount { get; set; }
    }
}
