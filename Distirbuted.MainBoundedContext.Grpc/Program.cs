using Application.MainBoundedContext.Commands;
using Application.MainBoundedContext.Handlers;
using Application.MainBoundedContext.Queries;
using Application.MainBoundedContextDTO.Orders;
using Application.MainBoundedContextDTO.Tickets;
using Application.MainBoundedContextDTO.Transactions;
using Application.Seedwork;
using Distirbuted.MainBoundedContext.Grpc.Services;
using Infrastructure.Crosscutting.Framework.Models;
using Infrastructure.Data.MainBoundedContext.DependencyInjection;
using Infrastructure.Data.MainBoundedContext.Seeding;

var builder = WebApplication.CreateBuilder(args);

// Load Docker-specific settings if running in Docker
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Add services to the container.
builder.Services.AddGrpc();

// Enable gRPC reflection
builder.Services.AddGrpcReflection();

// Infrastructure
builder.Services.AddMainBoundedContext(
    builder.Configuration.GetConnectionString("TicketingSystemDB")!);

// DI
builder.Services.AddScoped<ICommandHandler<AddOrderLineCommand, OrderDTO>, AddOrderLineCommandHandler>();
builder.Services.AddScoped<ICommandHandler<BookTicketCommand, OrderDTO>, BookTicketCommandHandler>();
builder.Services.AddScoped<ICommandHandler<InitiatePaymentCommand, TransactionDTO>, InitiatePaymentCommandHandler>();

builder.Services.AddScoped<IQueryHandler<GetPaginatedTicketsQuery, PagedResult<TicketDTO>>,
    GetPaginatedTicketsQueryHandler>();

var app = builder.Build();

// Seed application data
await ApplicationSeeder.SeedAsync(app.Services);

// Configure the HTTP request pipeline.
app.MapGrpcService<OrderGrpcService>();
app.MapGrpcService<CustomerGrpcService>();
app.MapGrpcService<TicketGrpcService>();
app.MapGrpcService<TransactionGrpcService>();

app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
