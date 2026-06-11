using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.MainBoundedContext.Orders
{
    public static class OrderFactory
    {
        public static Order Create(
            Guid customerId)
        {
            var order = new Order(customerId);
            
            return order;
        }
    }
}
