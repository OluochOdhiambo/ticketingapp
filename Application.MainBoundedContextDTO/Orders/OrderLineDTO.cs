using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MainBoundedContextDTO.Orders
{
    public class OrderLineDTO
    {
        public Guid? Id { get; set; }

        public Guid OrderId { get; set; }

        public Guid TicketId { get; set; }

        public int Quantity { get; set; }

        public string CurrencyCode { get; set; } = null!;

        public decimal UnitPrice { get; set; }

        public decimal LineTotal { get; set; }
    }
}
