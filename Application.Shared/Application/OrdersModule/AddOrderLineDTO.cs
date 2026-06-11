using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Shared.Application.OrdersModule
{
    public class AddOrderLineDTO
    {
        public Guid OrderId { get; set; }

        public Guid TicketId { get; set; }

        public int Quantity { get; set; }
    }
}
