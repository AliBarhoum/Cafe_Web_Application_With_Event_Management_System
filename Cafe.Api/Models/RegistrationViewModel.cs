namespace Cafe.api.Models;


public class EventRegistrationViewModel
{
    public int EventId { get; set; }
    public required string EventTitle { get; set; }
    public DateTime EventDate { get; set; }
    public bool IsRegistered { get; set; }   // for the current user
}