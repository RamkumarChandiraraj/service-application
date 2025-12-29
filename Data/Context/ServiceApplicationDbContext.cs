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
        public DbSet<Location> Locations { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Registration> Registrations { get; set; }


        public DbSet<Attachment> Attachments { get; set; }


    }
}
