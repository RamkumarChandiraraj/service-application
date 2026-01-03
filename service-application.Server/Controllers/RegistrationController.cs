using Common.Base;
using Common.BaseResponse;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Context;
using Data.Entities;
using Mapster;
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

        public RegistrationController(IRegistrationService registrationService,
                                      IApiMessage<IApiResponse> apiResponse)
        {
            _registrationService = registrationService;
            _apiResponse = apiResponse;
        }

        // POST: api/Registration
        [HttpPost]
        public async ValueTask<IActionResult> Create([FromBody] RegistrationRequestDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.CompanyName))
                    return _apiResponse.BadRequest("CompanyName is required");

                if (string.IsNullOrWhiteSpace(dto.Email))
                    return _apiResponse.BadRequest("Email is required");

                //  Phone number validation for LONG
                if (dto.PhoneNumber <= 0)
                    return _apiResponse.BadRequest("PhoneNumber is required");

                //  10-digit check for long
                if (dto.PhoneNumber < 1000000000 || dto.PhoneNumber > 9999999999)
                    return _apiResponse.BadRequest("PhoneNumber must be exactly 10 digits");

                //  Normalize email
                dto.Email = dto.Email.ToLower();

                //  Duplicate Email Check
                if (await _registrationService.EmailExists(dto.Email))
                    return _apiResponse.BadRequest("Email already exists");

                //  Duplicate Phone Number Check
                if (await _registrationService.PhoneNumberExists(dto.PhoneNumber))
                    return _apiResponse.BadRequest("PhoneNumber already exists");

                return await _registrationService.Create(dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }



        // GET: api/Registration/{id}
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

        // GET: api/Registration/list
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

        // PUT: api/Registration
        [HttpPut("{id}")]
        public async ValueTask<IActionResult> Update(
     int id,
     [FromBody] RegistrationRequestDto dto)
        {
            try
            {
                return await _registrationService.Update(id, dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        // DELETE: api/Registration/{id}
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
    }
}