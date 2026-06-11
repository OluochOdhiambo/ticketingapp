using Domain.MainBoundedContext.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.MainBoundedContext.Configurations
{
    public sealed class JournalEntityConfiguration
        : IEntityTypeConfiguration<Journal>
    {
        public void Configure(EntityTypeBuilder<Journal> builder)
        {
            builder.HasKey(j => j.Id);

            builder.Property(j => j.Description)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(j => j.Status)
                .IsRequired();

            builder.Property(j => j.ReversalOfJournalId);

            builder.HasMany(j => j.Entries)
                .WithOne(e => e.Journal)
                .HasForeignKey(e => e.JournalId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
