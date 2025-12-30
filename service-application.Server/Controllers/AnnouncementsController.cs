using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace service_application.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementsService _announcementsService;

        public AnnouncementsController(IAnnouncementsService announcementsService)
        {
            _announcementsService = announcementsService;
        }

        // GET: api/announcements
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _announcementsService.GetAllAsync();
            return Ok(result);
        }

        // GET: api/announcements/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var result = await _announcementsService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST: api/announcements
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AnnouncementsRequestDto request)
        {
            var result = await _announcementsService.CreateAsync(request);
            return Ok(result);
        }

        // PUT: api/announcements/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] AnnouncementsRequestDto request)
        {
            var result = await _announcementsService.UpdateAsync(id, request);
            return Ok(result);
        }

        // DELETE: api/announcements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var result = await _announcementsService.DeleteAsync(id);
            return Ok(result);

        }
    }
}
