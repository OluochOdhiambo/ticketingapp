using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MainBoundedContextDTO.Accounts
{
    public class JournalEntryDTO
    {
        public Guid Id { get; set; }

        public Guid AccountId { get; set; }

        public string AccountName { get; set; } = string.Empty;

        public decimal Debit { get; set; }

        public decimal Credit { get; set; }

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; }
    }
}
