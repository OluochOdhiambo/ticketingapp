using Domain.MainBoundedContext.Accounts;
using Domain.MainBoundedContext.Customers;
using Domain.MainBoundedContext.Tickets;
using Domain.MainBoundedContext.ValueObjects;
using Infrastructure.Crosscutting.Framework.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Data.MainBoundedContext.Seeding
{
    public static class ApplicationSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();

            var dbContext = scope.ServiceProvider
                .GetRequiredService<MainDbContext>();

            await SeedAccountsAsync(dbContext);
            await SeedCustomersAsync(dbContext);
            await SeedTicketsAsync(dbContext);

            await dbContext.SaveChangesAsync();
        }

        private static async Task SeedAccountsAsync(
            MainDbContext dbContext)
        {
            if (dbContext.Set<Account>().Any())
                return;

            var accounts = new[]
            {
                new Account(
                    "Cash",
                    "1100",
                    "Cash/Payment Gateway",
                    true,
                    "_SYS_"),

                new Account(
                    "Sales",
                    "4100",
                    "Ticket Sales Revenue",
                    true,
                    "_SYS_"),
            };

            await dbContext.Set<Account>().AddRangeAsync(accounts);
        }


        private static async Task SeedCustomersAsync(
            MainDbContext dbContext)
        {
            if (dbContext.Set<Customer>().Any())
                return;

            var customers = new[]
            {
                new Customer(
                    "CUST001",
                    "John",
                    "Doe",
                    "john.doe@email.com",
                    "+254500000001"),

                new Customer(
                    "CUST002",
                    "Jane",
                    "Smith",
                    "jane.smith@email.com",
                    "+254500000002"),

                new Customer(
                    "CUST003",
                    "Michael",
                    "Johnson",
                    "michael.johnson@email.com",
                    "+254500000003")
            };

            await dbContext.Set<Customer>().AddRangeAsync(customers);
        }

        private static async Task SeedTicketsAsync(
            MainDbContext dbContext)
        {
            if (dbContext.Set<Ticket>().Any())
                return;

            var tickets = new[]
            {
                new Ticket(
                    TicketType.Gold,
                    1000,
                    new Money(100m, "AED")),

                new Ticket(
                    TicketType.Premium,
                    1000,
                    new Money(200m, "AED")),

                new Ticket(
                    TicketType.VIP,
                    1000,
                    new Money(500m, "AED"))
            };

            await dbContext.Set<Ticket>().AddRangeAsync(tickets);
        }
    }
}