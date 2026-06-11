using System;
using System.Collections.Generic;
using System.Text;

namespace Application.MainBoundedContextDTO.Accounts
{
    public class JournalDTO
    {
        public Guid Id { get; set; }

        public string JournalNumber { get; set; } = string.Empty;

        public string Description { get; set; } = null!;

        public DateTime JournalDate { get; set; }

        public byte Status { get; set; }

        public string CreatedBy { get; set; } = null!;

        public DateTime CreatedDate { get; set; }

        public List<JournalEntryDTO> Entries { get; set; } = new List<JournalEntryDTO>();
    }
}
