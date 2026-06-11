using Domain.MainBoundedContext.Payments;
using Domain.Seedwork;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.MainBoundedContext.Transactions
{
    public interface ITransactionRepository : IRepository<Transaction>
    {
    }
}
