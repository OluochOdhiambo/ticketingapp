using Domain.Seedwork;
using Infrastructure.Crosscutting.Framework.Utils;

namespace Domain.MainBoundedContext.Accounts
{
    public class Journal : AggregateRoot
    {
        private readonly List<JournalEntry> _entries = new();

        private Journal() { }

        internal Journal(string description, string createdBy)
        {
            Description = description;
            CreatedDate = DateTime.UtcNow;
            CreatedBy = createdBy;
            Status = JournalStatus.Pending;

            GenerateNewIdentity();
        }

        public string Description { get; set; } = string.Empty;

        public JournalStatus Status { get; private set; }

        public Guid? ReversalOfJournalId { get; private set; }

        public bool IsReversal => ReversalOfJournalId.HasValue;

        public IReadOnlyCollection<JournalEntry> Entries => _entries.AsReadOnly();

        public void AddEntry(Account account, decimal debit, decimal credit, string createdBy)
        {
            if (account == null)
                throw new ArgumentNullException(nameof(account));

            if (debit <= 0 && credit <= 0)
                throw new ArgumentException("Debit or credit amount must be greater than zero.");

            if (debit > 0 && credit > 0)
                throw new ArgumentException("An entry cannot have both debit and credit.");

            if (Status != JournalStatus.Pending)
                throw new InvalidOperationException("Cannot add entries to a posted journal.");

            var entry = new JournalEntry(
                Id,
                account,
                debit,
                credit,
                createdBy);

            _entries.Add(entry);
        }

        public void ValidateBalance()
        {
            var totalDebits = _entries.Sum(e => e.Debit);
            var totalCredits = _entries.Sum(e => e.Credit);

            if (Math.Abs(totalDebits - totalCredits) > 0.01m)
                throw new InvalidOperationException("Journal is not balanced.");
        }

        public void Post()
        {
            if (!Entries.Any())
                throw new InvalidOperationException("Cannot post a journal with no entries.");

            ValidateBalance();

            Status = JournalStatus.Posted;
        }

        public Journal Reverse(string createdBy)
        {
            if (Status != JournalStatus.Posted)
                throw new InvalidOperationException("Only posted journals can be reversed.");

            var reversal = new Journal($"Reversal of journal {Id}", createdBy)
            {
                ReversalOfJournalId = Id
            };

            foreach (var entry in _entries)
            {
                reversal.AddEntry(
                    entry.Account,
                    entry.Credit, // swap
                    entry.Debit,  // swap
                    createdBy
                );
            }

            return reversal;
        }
    }
}