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
        [HttpPut]
        public async ValueTask<IActionResult> Update([FromBody] RegistrationRequestDto dto)
        {
            try
            {
                return await _registrationService.Update(dto);
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