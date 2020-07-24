using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Store.Domain;
using Store.Domain.Identity;

namespace Store.Repository
{
    public class StoreContext : IdentityDbContext<User,Role,int,
                                                        IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>,
                                                        IdentityRoleClaim<int>,IdentityUserToken<int>>
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options){}
        public DbSet<Costumer> Costumers {get; set;}
        public DbSet<Order> Orders {get; set;}
        public DbSet<OrderProduct> OrderProducts {get; set;}
        public DbSet<Product> Products {get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRole>(userRole => {
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                userRole.HasOne(ur => ur.Role)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.RoleId)
                        .IsRequired();

                userRole.HasOne(ur => ur.User)
                        .WithMany(r => r.UserRoles)
                        .HasForeignKey(ur => ur.UserId)
                        .IsRequired();
            });
        }
    }
}