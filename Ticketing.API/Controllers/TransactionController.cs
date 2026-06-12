using Application.Contracts.Services;
using Application.Shared.Application.TransactionsModule;
using Microsoft.AspNetCore.Mvc;

namespace Ticketing.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : Controller
    {
        private readonly ITransactionGatewayService _transactionGatewayService;

        public TransactionController(
            ITransactionGatewayService transactionGatewayService)
        {
            _transactionGatewayService = transactionGatewayService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransaction(Guid id)
        {
            var result = await _transactionGatewayService.GetTransactionAsync(id);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> InitiatePayment([FromBody] InitiatePaymentDTO request)
        {
            var result = await _transactionGatewayService.InitiatePaymentAsync(request);

            return Ok(result);
        }
    }
}
