using Domain.MainBoundedContext.Customers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.MainBoundedContext.Configurations
{
    public sealed class CustomerEntityConfiguration
        : IEntityTypeConfiguration<Customer>
    {
        public void Configure(EntityTypeBuilder<Customer> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.FirstName)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(a => a.LastName)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(a => a.Email)
                .IsRequired()
                .HasMaxLength(30);

            builder.Property(a => a.PhoneNumber)
                .IsRequired()
                .HasMaxLength(15);
        }
    }
}
