using Domain.Seedwork;

namespace Domain.MainBoundedContext.Orders
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<Order?> GetOrderWithLinesByIdAsync(Guid id);
    }
}
