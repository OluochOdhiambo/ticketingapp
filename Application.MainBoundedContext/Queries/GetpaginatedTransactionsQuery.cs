using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;
using Infrastructure.Crosscutting.Framework.Models;

namespace Application.MainBoundedContext.Queries
{
    public class GetpaginatedTransactionsQuery
        : IQuery<PagedResult<TransactionDTO>>
    {
    }
}
