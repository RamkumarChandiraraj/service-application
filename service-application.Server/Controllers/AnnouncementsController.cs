using Common.Base;
using Common.BaseResponse;
using Common.RequestDto;
using Common.ResponseDto;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementsService _announcementService;
        private readonly IApiMessage<IApiResponse> _apiResponse;

        public AnnouncementsController(
            IAnnouncementsService announcementService,
            IApiMessage<IApiResponse> apiResponse)
        {
            _announcementService = announcementService;
            _apiResponse = apiResponse;
        }

        // ✅ CREATE
        [HttpPost]
        public async ValueTask<IActionResult> Create([FromBody] AnnouncementsRequestDto dto)
        {
            if (dto == null)
                return _apiResponse.BadRequest("Request body is required");

            if (string.IsNullOrWhiteSpace(dto.Title))
                return _apiResponse.BadRequest("Title is required");

            if (string.IsNullOrWhiteSpace(dto.Description))
                return _apiResponse.BadRequest("Description is required");

            var result = await _announcementService.CreateAsync(dto);
            return _apiResponse.Ok(result.ID);
        }

        // ✅ GET BY ID
        [HttpGet("{id:long}")]
        public async ValueTask<IActionResult> GetById(long id)
        {
            if (id <= 0)
                return _apiResponse.BadRequest("Invalid Id");

            var result = await _announcementService.GetByIdAsync(id);
            if (result == null)
                return _apiResponse.NotFound("Announcement not found");

            return _apiResponse.Ok(result);
        }

        // ✅ UPDATE
        [HttpPut("{id:long}")]
        public async ValueTask<IActionResult> Update(long id, [FromBody] AnnouncementsRequestDto dto)
        {
            if (id <= 0)
                return _apiResponse.BadRequest("Invalid Id");

            if (dto == null)
                return _apiResponse.BadRequest("Request body is required");

            var updated = await _announcementService.UpdateAsync(id, dto);
            if (!updated)
                return _apiResponse.NotFound("Announcement not found");

            return _apiResponse.Ok(true);
        }

        // ✅ DELETE
        [HttpDelete("{id:long}")]
        public async ValueTask<IActionResult> Delete(long id)
        {
            if (id <= 0)
                return _apiResponse.BadRequest("Invalid Id");

            var deleted = await _announcementService.DeleteAsync(id);
            if (!deleted)
                return _apiResponse.NotFound("Announcement not found");

            return _apiResponse.Ok(true);
        }

        // ✅ GET ALL
        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAll()
        {
            var data = await _announcementService.GetAllAsync();
            return _apiResponse.Ok(data);
        }
    }
}
