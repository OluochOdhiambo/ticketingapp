using Application.Contracts.Services;
using Application.Shared.Application.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Ticketing.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private readonly ICustomerGatewayService _customerGatewayService;

        public CustomerController(ICustomerGatewayService customerGatewayService)
        {
            _customerGatewayService = customerGatewayService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] PagedRequest request)
        {
            var pagedCustomers = await _customerGatewayService.GetCustomersAsync(request);

            return Ok(pagedCustomers);
        }
    }
}
