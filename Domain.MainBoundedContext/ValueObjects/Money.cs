using System;
using Domain.Seedwork;

namespace Domain.MainBoundedContext.ValueObjects
{
    public sealed class Money : ValueObject
    {
        public decimal Amount { get; }
        public string Currency { get; }

        private Money() { }

        public Money(decimal amount, string currency)
        {
            if (amount < 0)
                throw new DomainException("Money amount cannot be negative.");

            if (string.IsNullOrWhiteSpace(currency))
                throw new DomainException("Currency is required.");

            Amount = amount;
            Currency = currency;
        }

        public Money Add(Money other)
        {
            if (Currency != other.Currency)
                throw new DomainException("Cannot add money with different currencies.");

            return new Money(Amount + other.Amount, Currency);
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Amount;
            yield return Currency;
        }
    }

}
