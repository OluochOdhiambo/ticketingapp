using Domain.MainBoundedContext.Payments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.MainBoundedContext.Configurations
{
    public sealed class TransactionEntityConfiguration
        : IEntityTypeConfiguration<Transaction>
    {
        public void Configure(EntityTypeBuilder<Transaction> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.TransactionReference)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.TransactionAmount)
                .IsRequired()
                .HasPrecision(18, 2);
        }
    }
}
