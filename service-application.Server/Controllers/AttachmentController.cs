using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [ApiController]
    [Route("api/attachments")]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentService _attachmentService;
        private readonly IApiMessage<IApiResponse> _apiResponse;

        public AttachmentController(IAttachmentService attachmentService, IApiMessage<IApiResponse> apiResponse)
        {
            _attachmentService = attachmentService;
            _apiResponse = apiResponse;
        }

        // ================= UPLOAD =================
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] AttachmentRequestDto dto)
        {
            if (dto.File == null || dto.File.Length == 0)
                return _apiResponse.BadRequest("File is required");

            var result = await _attachmentService.UploadAsync(dto);
            return _apiResponse.Ok(result.ToMap<Attachment, AttachmentResponseDto>());
        }

        // ================= GET ALL =================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _attachmentService.GetAllAsync();
            return _apiResponse.Ok(result);
        }

        // ================= GET BY ID =================
        [HttpGet("{id:long}")]
        public async Task<IActionResult> GetById(long id)
        {
            var result = await _attachmentService.GetByIdAsync(id);
            if (result == null)
                return _apiResponse.NotFound("Attachment not found");

            return _apiResponse.Ok(result);
        }

        // ================= DOWNLOAD =================
        [HttpGet("download/{id:long}")]
        public async Task<IActionResult> Download(long id)
        {
            var result = await _attachmentService.GetByIdAsync(id);
            if (result == null)
                return _apiResponse.NotFound("Attachment not found");

            if (!System.IO.File.Exists(result.FilePath))
                return _apiResponse.NotFound("File not found");

            var bytes = await System.IO.File.ReadAllBytesAsync(result.FilePath);
            return File(bytes, "application/octet-stream", result.FileName);
        }

        // ================= DELETE =================
        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            var success = await _attachmentService.DeleteAsync(id);
            if (!success)
                return _apiResponse.NotFound("Attachment not found");

            return _apiResponse.Ok("Attachment deleted successfully");
        }

        // ================= UPDATE =================
        [HttpPut("{id:long}")]
        public async Task<IActionResult> Update(long id, [FromForm] AttachmentRequestDto dto)
        {
            var success = await _attachmentService.UpdateAsync(id, dto);
            if (!success)
                return _apiResponse.NotFound("Attachment not found");

            return _apiResponse.Ok("Attachment updated successfully");
        }
    }
}
