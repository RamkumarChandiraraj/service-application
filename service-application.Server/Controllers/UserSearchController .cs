using Common.Base;
using Common.BaseResponse;
using Common.RequestDto;
using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSearchController(IUserSearchService service, IApiMessage<IApiResponse> apiResponse) : ControllerBase
    {
        private readonly IUserSearchService _service = service;
        private readonly IApiMessage<IApiResponse> _apiResponse = apiResponse;

        [HttpPost]
        public async Task<IActionResult> SearchUsers([FromBody] UserSearchRequestDto dto)
        {
            try
            {
                if (dto.Latitude == 0 || dto.Longitude == 0)
                    return _apiResponse.BadRequest("Location is required");

                var result = await _service.SearchUsersAsync(dto);
                return _apiResponse.Ok(result);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }
    }
}
