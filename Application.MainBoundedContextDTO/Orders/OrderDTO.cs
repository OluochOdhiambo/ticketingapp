using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MainBoundedContextDTO.Orders
{
    public class OrderDTO
    {
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }

        public byte Status { get; set; }

        public string StatusDescription { get; set; } = string.Empty;

        public decimal TotalAmount { get; set; }

        public List<OrderLineDTO> OrderLines { get; set; } = new List<OrderLineDTO>();
    }
}
