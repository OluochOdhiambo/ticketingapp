using Application.MainBoundedContext.Queries;
using Application.MainBoundedContextDTO.Customers;
using Application.Seedwork;
using Azure.Core;
using Contracts.Grpc;
using Grpc.Core;
using Infrastructure.Crosscutting.Framework.Models;

namespace Distirbuted.MainBoundedContext.Grpc.Services
{
    public class CustomerGrpcService
        : CustomerService.CustomerServiceBase
    {
        private readonly IQueryHandler<GetPaginatedCustomersQuery, PagedResult<CustomerDTO>> _getPaginatedCustomersQueryHandler;

        public CustomerGrpcService(
            IQueryHandler<GetPaginatedCustomersQuery, PagedResult<CustomerDTO>> getPaginatedCustomersQueryHandler)
        {
            _getPaginatedCustomersQueryHandler = getPaginatedCustomersQueryHandler;
        }

        public override async Task<GetPaginatedCustomersResponse> GetPaginatedCustomers(
            GetPaginatedCustomersRequest request,
            ServerCallContext context)
        {
            var query = new GetPaginatedCustomersQuery(
                request.PageNumber,
                request.PageSize
            );

            var result = await _getPaginatedCustomersQueryHandler.HandleAsync(query, context.CancellationToken);

            if (result is null || !result.Items.Any())
            {
                return new GetPaginatedCustomersResponse
                {
                    TotalCount = 0,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize
                };
            }

            var response = new GetPaginatedCustomersResponse
            {
                TotalCount = result.TotalCount,
                PageNumber = result.PageNumber,
                PageSize = result.PageSize
            };

            response.Customers.AddRange(result.Items.Select(c =>
            new CustomerModel
            {
                Id = c.Id.ToString(),
                Code = c.Code,
                Firstname = c.FirstName,
                Lastname = c.LastName,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber
            }));

            return response;
        }
    }
}
