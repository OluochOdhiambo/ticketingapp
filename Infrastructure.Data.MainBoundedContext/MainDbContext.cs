using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Data.MainBoundedContext
{
    public sealed class MainDbContext : DbContext
    {
        public MainDbContext(
            DbContextOptions<MainDbContext> options
            ) : base( options )
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(
                typeof(MainDbContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }
    }
}
