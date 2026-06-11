using Application.Contracts.Services;
using Application.Shared.Application.Shared;
using Microsoft.AspNetCore.Mvc;

namespace Ticketing.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : Controller
    {
        private readonly ITicketGatewayService _ticketGatewayService;

        public TicketController(ITicketGatewayService ticketGatewayService)
        {
            _ticketGatewayService = ticketGatewayService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTickets([FromQuery] PagedRequest request)
        {
            var pagedTickets = await _ticketGatewayService.GetTicketsAsync(request);

            return Ok(pagedTickets);
        }
    }
}
