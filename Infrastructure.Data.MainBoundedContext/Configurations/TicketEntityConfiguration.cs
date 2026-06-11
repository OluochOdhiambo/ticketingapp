using Domain.MainBoundedContext.Tickets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.MainBoundedContext.Configurations
{
    public sealed class TicketEntityConfiguration
        : IEntityTypeConfiguration<Ticket>
    {
        public void Configure(EntityTypeBuilder<Ticket> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.QuantityOnHand)
                .IsRequired();

            builder.Property(a => a.QuantityReserved)
                .IsRequired();

            builder.OwnsOne(x => x.Price, money =>
            {
                money.Property(x => x.Amount)
                    .HasColumnName("Price")
                    .HasPrecision(18, 2)
                    .IsRequired();

                money.Property(x => x.Currency)
                    .HasColumnName("CurrencyCode")
                    .HasMaxLength(3)
                    .IsRequired();
            });

            builder.Ignore(x => x.AvailableToSell);
        }
    }
}
