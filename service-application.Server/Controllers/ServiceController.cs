using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using System.Net;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace service_application.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController(IServiceService service, IApiMessage<IApiResponse> apiResponse) : ControllerBase
    {
        private readonly IServiceService _service = service;
        private readonly IApiMessage<IApiResponse> _apiResponse = apiResponse;

        [HttpPost]
        public async ValueTask<IActionResult> CreateService([FromBody] ServiceRequestDto dto)
        {
            try
            {
                // 400 - Bad Request (DTO validation)
                if (string.IsNullOrEmpty(dto.Name))
                {
                    return _apiResponse.BadRequest("Name is required");
                }
                if(string.IsNullOrEmpty(dto.Description))
                {
                    return _apiResponse.BadRequest("Description is required");
                }

                var result = await _service.CreateServiceAsync(dto);

                // 200 - Created
                return _apiResponse.Ok(result.ID);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async ValueTask<IActionResult> GetServiceById(long id)
        {
            try
            {
                if(id<0)
                {
                    return _apiResponse.BadRequest($"Id is mandatory");
                }
                var entity = await _service.GetServiceById(id);
                var result= entity.ToMap<Service, ServiceResponseDto>();

                return _apiResponse.Ok(result);
            }
            catch(Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpPut()]
        public async ValueTask<IActionResult> UpdateService([FromBody] ServiceRequestDto dto)
        {
            try
            {
                if(dto.ID<0||string.IsNullOrEmpty(dto.Name)||string.IsNullOrEmpty(dto.Description))
                {
                    return _apiResponse.BadRequest("Fields are required");
                }
                await _service.UpdateServiceByIdAsync(dto);

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> DeleteService(long id)
        {
            try
            {
                if (id < 0)
                {
                    return _apiResponse.BadRequest("Id is mandatory");
                }
                await _service.DeleteServiceById(id);

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAllService(string? searchkeyword)
        {
            var results = await _service.GetAllService();

            if (!string.IsNullOrEmpty(searchkeyword))
            {
                searchkeyword = searchkeyword.ToLower();
                results = results.Where(x => x.Name.ToLower().Contains(searchkeyword) ||
                x.Description.ToLower().Contains(searchkeyword)
                ).ToList();
            }

            var dtos = results.ToMap<List<Service>, List<ServiceResponseDto>>();

            return _apiResponse.Ok(dtos);
        }

    }
}
