using Application.Contracts.Services;
using Application.Infrastructure.Gateway;
using Contracts.Grpc;
using Contracts.Protos;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddGatewayInfrastructure(
            this IServiceCollection services,
            string grpcBaseAddress)
        {

            services
                .AddGrpcClient<OrderService.OrderServiceClient>(o =>
                {
                    o.Address = new Uri(grpcBaseAddress);
                });

            services
                .AddGrpcClient<TransactionService.TransactionServiceClient>(o =>
                {
                    o.Address = new Uri(grpcBaseAddress);
                });

            services
                .AddGrpcClient<TicketService.TicketServiceClient>(o =>
                {
                    o.Address = new Uri(grpcBaseAddress);
                });


            services.AddScoped<IOrderGatewayService, OrderGatewayService>();
            services.AddScoped<ITicketGatewayService, TicketGatewayService>();
            services.AddScoped<ITransactionGatewayService, TransactionGatewayService>();

            return services;
        }
    }
}
