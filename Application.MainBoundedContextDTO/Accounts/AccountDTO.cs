using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MainBoundedContextDTO.Accounts
{
    public class AccountDTO
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public string Code { get; set; } = null!;

        public string Description { get; set; } = null!;

        public bool IsActive { get; set; }

        public bool IsControlAccount { get; set; }

        public bool IsPostingAccount { get; set; }

        public Guid? ParentAccountId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime? UpdatedDate { get; set; }

        public string UpdatedBy { get; set; } = string.Empty;

        public List<AccountDTO>? ChildAccounts { get; set; }
    }
}
