using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.MainBoundedContext.Accounts
{
    public static class JournalFactory
    {
        public static Journal CreateNewJournal(
            string description,
            string createdBy)
        {
            var journal = new Journal(description, createdBy);
            return journal;
        }
    }
}
