using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Context
{
    public class ServiceApplicationDbContext :DbContext
    {
        public ServiceApplicationDbContext(DbContextOptions<ServiceApplicationDbContext> options) : base(options)
        { 
        }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Service> Service { get; set; }
    }
}
