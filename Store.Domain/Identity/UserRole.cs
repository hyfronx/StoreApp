using Microsoft.AspNetCore.Identity;

namespace Store.Domain.Identity
{
    public class UserRole : IdentityUserRole<int>
    {
        public User User { get; set; }

        public Role Role { get; set; }
    }
}