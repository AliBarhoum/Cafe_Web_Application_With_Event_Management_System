using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cafe.Api.Data;
using Cafe.Api.Models;
using Cafe.Api.Models.Dtos;
using System.Security.Claims;

namespace Cafe.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Customer> _userManager;

        public EventsController(ApplicationDbContext context, UserManager<Customer> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents()
        {
            var events = await _context.Events
                .Select(e => new EventDto
                {
                    Id = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    Price = e.Price
                })
                .ToListAsync();

            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EventDto>> GetEvent(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null)
                return NotFound();

            return Ok(new EventDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                StartDate = ev.StartDate,
                EndDate = ev.EndDate,
                Price = ev.Price
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EventDto>> PostEvent([FromBody] EventCreateDto createDto)
        {
            if (createDto.StartDate >= createDto.EndDate)
                return BadRequest(new { message = "End date must be after start date." });

            var ev = new Event
            {
                Title = createDto.Title,
                Description = createDto.Description,
                StartDate = createDto.StartDate,
                EndDate = createDto.EndDate,
                Price = createDto.Price
            };

            _context.Events.Add(ev);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = ev.Id }, new EventDto
            {
                Id = ev.Id,
                Title = ev.Title,
                Description = ev.Description,
                StartDate = ev.StartDate,
                EndDate = ev.EndDate,
                Price = ev.Price
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutEvent(int id, [FromBody] EventUpdateDto updateDto)
        {
            if (updateDto.StartDate >= updateDto.EndDate)
                return BadRequest(new { message = "End date must be after start date." });

            var ev = await _context.Events.FindAsync(id);
            if (ev == null)
                return NotFound();

            ev.Title = updateDto.Title;
            ev.Description = updateDto.Description;
            ev.StartDate = updateDto.StartDate;
            ev.EndDate = updateDto.EndDate;
            ev.Price = updateDto.Price;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var ev = await _context.Events.FindAsync(id);
            if (ev == null)
                return NotFound();

            _context.Events.Remove(ev);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{eventId}/register")]
        [Authorize]
        public async Task<IActionResult> RegisterForEvent(int eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var existing = await _context.Registrations
                .FirstOrDefaultAsync(r => r.CustomerId == userId && r.EventId == eventId);
            if (existing != null)
                return BadRequest(new { message = "Already registered for this event." });

            var registration = new Registration
            {
                CustomerId = userId,
                EventId = eventId,
                RegistrationDate = DateTime.UtcNow,
                Status = "Confirmed"
            };

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful." });
        }

        [HttpGet("{eventId}/registered")]
        [Authorize]
        public async Task<ActionResult<bool>> IsUserRegistered(int eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var registered = await _context.Registrations
                .AnyAsync(r => r.CustomerId == userId && r.EventId == eventId);

            return Ok(registered);
        }
    }
}