using Domain.MainBoundedContext.Orders;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.MainBoundedContext.Configurations
{
    public sealed class OrderLineEntityConfiguration
        : IEntityTypeConfiguration<OrderLine>
    {
        public void Configure(EntityTypeBuilder<OrderLine> builder)
        {
            builder.HasKey(a => a.Id);

            builder.OwnsOne(x => x.UnitPrice, money =>
            {
                money.Property(x => x.Amount)
                    .HasColumnName("UnitPrice")
                    .HasPrecision(18, 2)
                    .IsRequired();

                money.Property(x => x.Currency)
                    .HasColumnName("CurrencyCode")
                    .HasMaxLength(3)
                    .IsRequired();
            });

            
        }
    }
}
