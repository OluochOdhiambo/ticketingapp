using Domain.MainBoundedContext.Accounts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.MainBoundedContext.Configurations
{
    public sealed class AccountEntityConfiguration
        : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(a => a.Code)
                .IsRequired()
                .HasMaxLength(10);

            builder.Property(a => a.Description)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(a => a.IsActive);

        }
    }
}
