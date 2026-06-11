using Domain.MainBoundedContext.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.MainBoundedContext.Configurations
{
    public sealed class JournalEntryEntityConfiguration
        : IEntityTypeConfiguration<JournalEntry>
    {
        public void Configure(EntityTypeBuilder<JournalEntry> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(je => je.Credit)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(je => je.Debit)
                .IsRequired()
                .HasPrecision(18, 2);
        }
    }
}
