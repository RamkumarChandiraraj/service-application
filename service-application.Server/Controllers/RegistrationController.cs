using Common.Base;
using Common.BaseResponse;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationController : ControllerBase
    {
        private readonly IRegistrationService _registrationService;
        private readonly IApiMessage<IApiResponse> _apiResponse;
        private readonly IRepositary<Attachment> _attachmentRepository;

        public RegistrationController(
            IRegistrationService registrationService,
            IApiMessage<IApiResponse> apiResponse,
            IRepositary<Attachment> attachmentRepository)
        {
            _registrationService = registrationService;
            _apiResponse = apiResponse;
            _attachmentRepository = attachmentRepository;
        }

        // ================== CREATE ==================
        [HttpPost]
        public async ValueTask<IActionResult> Create([FromBody] RegistrationRequestDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.CompanyName))
                    return _apiResponse.BadRequest("CompanyName is required");

                if (string.IsNullOrWhiteSpace(dto.Email))
                    return _apiResponse.BadRequest("Email is required");

                if (dto.PhoneNumber <= 0 || dto.PhoneNumber < 1000000000 || dto.PhoneNumber > 9999999999)
                    return _apiResponse.BadRequest("PhoneNumber must be exactly 10 digits");

                dto.Email = dto.Email.ToLower();

                if (await _registrationService.EmailExists(dto.Email))
                    return _apiResponse.BadRequest("Email already exists");

                if (await _registrationService.PhoneNumberExists(dto.PhoneNumber))
                    return _apiResponse.BadRequest("PhoneNumber already exists");

                // Optional: validate ProfileImageId
                if (dto.ProfileImageId != null)
                {
                    var exists = await _attachmentRepository
                        .FindByCondition(a => a.ID == dto.ProfileImageId)
                        .AnyAsync();

                    if (!exists)
                        return _apiResponse.BadRequest("Invalid ProfileImageId");
                }

                return await _registrationService.Create(dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ================== GET BY ID ==================
        [HttpGet("{id:long}")]
        public async ValueTask<IActionResult> Get(long id)
        {
            try
            {
                return await _registrationService.Get(id);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ================== GET ALL ==================
        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAll()
        {
            try
            {
                return await _registrationService.GetAll();
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ================== UPDATE ==================
        [HttpPut("{id}")]
        public async ValueTask<IActionResult> Update(long id, [FromBody] RegistrationRequestDto dto)
        {
            try
            {
                // Optional: validate ProfileImageId
                if (dto.ProfileImageId != null)
                {
                    var exists = await _attachmentRepository
                        .FindByCondition(a => a.ID == dto.ProfileImageId)
                        .AnyAsync();

                    if (!exists)
                        return _apiResponse.BadRequest("Invalid ProfileImageId");
                }

                return await _registrationService.Update(id, dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ================== DELETE ==================
        [HttpDelete("{id:long}")]
        public async ValueTask<IActionResult> Delete(long id)
        {
            try
            {
                return await _registrationService.Delete(id);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // ================== UPLOAD PROFILE IMAGE ==================
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return _apiResponse.BadRequest("File is required");

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var attachment = new Attachment
                {
                    FileName = fileName,
                    FilePath = filePath
                };

                await _attachmentRepository.CreateAsync(attachment);

                // Return the ID and URL
                return Ok(new
                {
                    attachment.ID,
                    FileName = attachment.FileName,
                    FileUrl = "/Uploads/" + attachment.FileName
                });
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }
    }
}
