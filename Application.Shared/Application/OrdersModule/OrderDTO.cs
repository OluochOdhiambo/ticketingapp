using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Shared.Application.OrdersModule
{
    public class OrderDTO
    {
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }

        public string Status { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public List<OrderLineDTO> OrderLines { get; set; } = new List<OrderLineDTO>();
    }
}
