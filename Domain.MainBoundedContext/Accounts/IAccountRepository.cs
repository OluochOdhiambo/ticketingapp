using Domain.Seedwork;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.MainBoundedContext.Accounts
{
    public interface IAccountRepository : IRepository<Account>
    {
        Task<Account?> GetAccountByCodeAsync(string accountCode);
    }
}
