using Microsoft.AspNetCore.Identity;

namespace Cafe.Api.Models
{
    public class Customer : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public ICollection<Registration> Registrations { get; set; }
    }
}