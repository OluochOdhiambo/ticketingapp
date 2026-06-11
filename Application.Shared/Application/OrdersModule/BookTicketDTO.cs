using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Shared.Application.OrdersModule
{
    public class BookTicketDTO
    {
        public Guid CustomerId { get; set;  }

        public AddOrderLineDTO Line { get; set; } = new AddOrderLineDTO();
    }
}
