using Application.MainBoundedContextDTO.Customers;
using Application.Shared.Application.Shared;

namespace Application.Contracts.Services
{
    public interface ICustomerGatewayService
    {
        Task<PagedSet<CustomerDTO>> GetCustomersAsync(PagedRequest request);
    }
}
