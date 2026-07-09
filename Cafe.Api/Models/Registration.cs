namespace Cafe.Api.Models
{
    public class Registration
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public int EventId { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string Status { get; set; }
        public Customer Customer { get; set; }
        public Event Event { get; set; }
    }
}