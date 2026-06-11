using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.MainBoundedContext.Accounts
{
    public static class AccountFactory
    {
        public static Account CreateNewAccount(string name, string code, string description, bool isActive, string createdBy)
        {
            var account = new Account(name, code, description, isActive, createdBy);

            return account;
        }
    }
}
