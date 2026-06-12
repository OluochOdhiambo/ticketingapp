using Application.Shared.Application.OrdersModule;

namespace Application.Contracts.Services
{
    public interface IOrderGatewayService
    {
        Task<OrderDTO> AddOrderLineAsync(AddOrderLineDTO dto);

        Task<OrderDTO> RemoveOrderLineAsync(AddOrderLineDTO dto);

        Task<OrderDTO> BookTicketAsync(BookTicketDTO dto);
    }
}
