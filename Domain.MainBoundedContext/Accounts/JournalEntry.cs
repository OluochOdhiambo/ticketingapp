using Domain.Seedwork;

namespace Domain.MainBoundedContext.Accounts
{
    public class JournalEntry : Entity
    {
        private JournalEntry() { } // For EF

        internal JournalEntry(
            Guid journalId,
            Account account,
            decimal debit,
            decimal credit,
            string createdBy)
        {
            if (account == null)
                throw new ArgumentNullException(nameof(account));

            if (debit <= 0 && credit <= 0)
                throw new ArgumentException("Debit or credit amount must be greater than zero.");

            if (debit > 0 && credit > 0)
                throw new ArgumentException("An entry cannot have both debit and credit.");

            JournalId = journalId;

            Account = account;
            AccountId = account.Id;

            Debit = debit;
            Credit = credit;

            CreatedBy = createdBy;
            CreatedDate = DateTime.UtcNow;
        }

        public Guid JournalId { get; private set; }

        public virtual Journal Journal { get; private set; }

        public Guid AccountId { get; private set; }

        public virtual Account Account { get; private set; }

        public decimal Debit { get; private set; }

        public decimal Credit { get; private set; }
    }
}