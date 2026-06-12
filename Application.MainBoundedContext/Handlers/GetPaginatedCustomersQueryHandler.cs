using Application.MainBoundedContext.Queries;
using Application.MainBoundedContextDTO.Customers;
using Application.Seedwork;
using Domain.MainBoundedContext.Customers;
using Infrastructure.Crosscutting.Framework.Models;

namespace Application.MainBoundedContext.Handlers
{
    public sealed class GetPaginatedCustomersQueryHandler
        : IQueryHandler<GetPaginatedCustomersQuery, PagedResult<CustomerDTO>>
    {
        private readonly ICustomerRepository _customerRepository;

        public GetPaginatedCustomersQueryHandler(
            ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<PagedResult<CustomerDTO>> HandleAsync(GetPaginatedCustomersQuery query, CancellationToken cancellationToken)
        {
            var result = await _customerRepository.GetPagedCustomersAsync(query.PageNumber, query.PageSize);

            var pagedCustomerDTOs = new PagedResult<CustomerDTO>(
                items: result.Items.Select(customer => new CustomerDTO
                {
                    Id = customer.Id,
                    Code = customer.Code,
                    FirstName = customer.FirstName,
                    LastName = customer.LastName,
                    Email = customer.Email,
                    PhoneNumber = customer.PhoneNumber
                }).ToList(),
                totalCount: result.TotalCount,
                pageNumber: result.PageNumber,
                pageSize: result.PageSize
                );

            return pagedCustomerDTOs;
        }
    }
}
