using Domain.MainBoundedContext.Accounts;
using Domain.MainBoundedContext.Customers;
using Domain.MainBoundedContext.Orders;
using Domain.MainBoundedContext.Tickets;
using Domain.MainBoundedContext.Transactions;
using Domain.Seedwork;
using Infrastructure.Data.MainBoundedContext.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.MainBoundedContext.DependencyInjection
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMainBoundedContext(
            this IServiceCollection services,
            string connectionString)
        {
            // DbContext
            services.AddDbContext<MainDbContext>(options =>
                options.UseSqlServer(connectionString));
            // Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Repositories
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IJournalRepository, JournalRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<ITicketRepository, TicketRepository>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();

            return services;
        }
    }
}
