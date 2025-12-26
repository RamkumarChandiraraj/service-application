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
    [Route("api/[controller]")]
    [ApiController]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentService _attachmentService;
        private readonly IApiMessage<IApiResponse> _apiResponse;

        public AttachmentController(
            IAttachmentService attachmentService,
            IApiMessage<IApiResponse> apiResponse)
        {
            _attachmentService = attachmentService;
            _apiResponse = apiResponse;
        }

        [HttpPost("upload")]
        public async ValueTask<IActionResult> Upload(
            [FromForm] AttachmentRequestDto dto)
        {
            try
            {
                if (dto.File == null || dto.File.Length == 0)
                    return _apiResponse.BadRequest("File is required");

                var result = await _attachmentService.UploadAsync(dto);
                if (result == null)
                    return _apiResponse.BadRequest("Upload failed");
                return _apiResponse.Ok(result.ToMap<Attachment, AttachmentResponseDto>());
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("{id:long}")]
        public async ValueTask<IActionResult> GetById(long id)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                var result = await _attachmentService.GetByIdAsync(id);
                if (result == null)
                    return _apiResponse.NotFound("Attachment not found");

                return _apiResponse.Ok(result);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("download/{id:long}")]
        public async ValueTask<IActionResult> Download(long id)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                var result = await _attachmentService.GetByIdAsync(id);
                if (result == null)
                    return _apiResponse.NotFound("Attachment not found");

                if (!System.IO.File.Exists(result.FilePath))
                    return _apiResponse.NotFound("File not found on server");

                var bytes = await System.IO.File.ReadAllBytesAsync(result.FilePath);
                var contentType = GetContentType(result.FileName);

                return File(bytes, contentType, result.FileName);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        private static string GetContentType(string fileName)
        {
            return Path.GetExtension(fileName).ToLower() switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".webp" => "image/webp",
                ".pdf" => "application/pdf",
                _ => "application/octet-stream"
            };
        }
    }
}
