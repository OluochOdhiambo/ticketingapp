using Domain.Seedwork;

namespace Domain.MainBoundedContext.Accounts
{
    public class Account : AggregateRoot
    {
        private Account() { }

        public Account(string name, string code, string description, bool isActive, string createdBy)
        {
            Name = name;
            Code = code;
            Description = description;
            IsActive = isActive;
            CreatedBy = createdBy;

            GenerateNewIdentity();
        }

        public string Name { get; set; }

        public string Code { get; set; }

        public string Description { get; set; }

        public bool IsActive { get; set; }

        public void Deactivate()
        {
            IsActive = false;
        }

        public void UpdateDescription(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
                throw new ArgumentException("Description cannot be empty.");

            Description = description;
        }
    }
}