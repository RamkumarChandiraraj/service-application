using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController(ILocationService location, IApiMessage<IApiResponse> apiResponse) : ControllerBase
    {
        private readonly ILocationService _location = location;
        private readonly IApiMessage<IApiResponse> _apiResponse = apiResponse;

        [HttpPost]
        public async ValueTask<IActionResult> CreateLocation([FromBody] LocationRequestDto dto)
        {
            try
            {
                // 400 - Bad Request (DTO validation)
                if (string.IsNullOrEmpty(dto.Name))
                {
                    return _apiResponse.BadRequest("Name is required");
                }

                var result = await _location.CreateLocationAsync(dto);

                // 200 - Created
                return _apiResponse.Ok(result.ID);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async ValueTask<IActionResult> GetLocationById(long id)
        {
            try
            {
                if (id < 0)
                {
                    return _apiResponse.BadRequest("Id is mandatory");
                }

                var entity = await _location.GetLocationById(id);
                var result = entity.ToMap<Location, LocationResponseDto>();

                return _apiResponse.Ok(result);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpPut]
        public async ValueTask<IActionResult> UpdateLocation([FromBody] LocationRequestDto dto)
        {
            try
            {
                if (dto.ID < 0 || string.IsNullOrEmpty(dto.Name))
                {
                    return _apiResponse.BadRequest("Fields are required");
                }

                await _location.UpdateLocationByIdAsync(dto);

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> DeleteLocation(long id)
        {
            try
            {
                if (id < 0)
                {
                    return _apiResponse.BadRequest("Id is mandatory");
                }

                await _location.DeleteLocationById(id);

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAllLocation(string? searchkeyword)
        {
            var results = await _location.GetAllLocation();

            if (!string.IsNullOrEmpty(searchkeyword))
            {
                searchkeyword = searchkeyword.ToLower();

                results = results.Where(x =>
                    x.Name.ToLower().Contains(searchkeyword) ||
                    (x.Description != null && x.Description.ToLower().Contains(searchkeyword)) ||
                    (x.LocationCode != null && x.LocationCode.ToLower().Contains(searchkeyword))
                ).ToList();
            }

            var dtos = results.ToMap<List<Location>, List<LocationResponseDto>>();

            return _apiResponse.Ok(dtos);
        }
    }
}
