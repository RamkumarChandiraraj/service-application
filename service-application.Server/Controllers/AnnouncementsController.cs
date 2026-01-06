using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using Mapster;


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
            try
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
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ✅ GET BY ID
        [HttpGet("{id:long}")]
        public async ValueTask<IActionResult> GetById(long id)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                var entity = await _announcementService.GetByIdAsync(id);
                if (entity == null)
                    return _apiResponse.NotFound("Announcement not found");

                // ✅ Use ToMap now
              
                //var dto = entity.ToMap<AnnouncementsResponseDto,Announcements>();
                return _apiResponse.Ok(entity);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ✅ UPDATE
        [HttpPut("{id:long}")]
        public async ValueTask<IActionResult> Update(long id, [FromBody] AnnouncementsRequestDto dto)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                if (dto == null)
                    return _apiResponse.BadRequest("Request body is required");

                if (string.IsNullOrWhiteSpace(dto.Title))
                    return _apiResponse.BadRequest("Title is required");

                if (string.IsNullOrWhiteSpace(dto.Description))
                    return _apiResponse.BadRequest("Description is required");

                // 🔑 Sync route id with DTO
                dto.ID = id;

                //var updated = await _announcementService.UpdateAsync(dto);
                //if (!updated)
                //    return _apiResponse.NotFound("Announcement not found");

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ✅ DELETE
        [HttpDelete("{id:long}")]
        public async ValueTask<IActionResult> Delete(long id)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                var deleted = await _announcementService.DeleteAsync(id);
                if (!deleted)
                    return _apiResponse.NotFound("Announcement not found");

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ✅ GET ALL
        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAll()
        {
            try
            {
                var data = await _announcementService.GetAllAsync();
                //var result = data.ToMap<List<Announcements>, List<AnnouncementsResponseDto>>();
                return _apiResponse.Ok(data);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }
    }
}
