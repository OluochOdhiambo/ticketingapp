using Application.Contracts.Services;
using Application.Shared.Application.OrdersModule;
using Microsoft.AspNetCore.Mvc;

namespace Ticketing.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : Controller
    {
        private readonly IOrderGatewayService _orderGatewayService;

        public OrderController(
            IOrderGatewayService orderGatewayService)
        {
            _orderGatewayService = orderGatewayService;
        }

        [HttpPost("book")]
        public async Task<IActionResult> BookTicket([FromBody] BookTicketDTO request)
        {
            var order = await _orderGatewayService.BookTicketAsync(request);

            return Ok(order);
        }

        [HttpPost("addorderline")]
        public async Task<IActionResult> AddOrderLine([FromBody] AddOrderLineDTO request)
        {
            var orderLine = await _orderGatewayService.AddOrderLineAsync(request);

            return Ok(orderLine);
        }

        [HttpPost("removeorderline")]
        public async Task<IActionResult> RemoveOrderLine([FromBody] RemoveOrderLineDTO request)
        {
            var orderLine = await _orderGatewayService.RemoveOrderLineAsync(request);

            return Ok(orderLine);
        }
    }
}
