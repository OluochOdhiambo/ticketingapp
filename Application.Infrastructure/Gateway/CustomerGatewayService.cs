using Application.MainBoundedContextDTO.Customers;
using Application.Shared.Application.Shared;
using Contracts.Grpc;
using Grpc.Core;

namespace Application.Infrastructure.Gateway
{
    public class CustomerGatewayService
    {
        private readonly CustomerService.CustomerServiceClient _client;

        public CustomerGatewayService(
            CustomerService.CustomerServiceClient client)
        {
            _client = client;
        }

        public async Task<PagedSet<CustomerDTO>> GetPaginatedCustomersAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _client.GetPaginatedCustomersAsync(
                    new GetPaginatedCustomersRequest
                    {
                        PageNumber = pageNumber,
                        PageSize = pageSize
                    },
                    cancellationToken: cancellationToken);

                var items = response.Customers.Select(c => new CustomerDTO
                {
                    Id = Guid.Parse(c.Id),
                    Code = c.Code,
                    FirstName = c.Firstname,
                    LastName = c.Lastname,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber
                }).ToList();

                return new PagedSet<CustomerDTO>(
                    items,
                    response.TotalCount,
                    response.PageNumber,
                    response.PageSize);
            }
            catch (RpcException ex)
            {
                throw;
            }
        }
    }
}
