using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Impl;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService user, IApiMessage<IApiResponse> apiResponse) : ControllerBase
    {
        private readonly IUserService _User = user;
        private readonly IApiMessage<IApiResponse> _apiResponse = apiResponse;

        [HttpPost]
        public async ValueTask<IActionResult> CreateUser(UserRequestDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.UserName))
                    return _apiResponse.BadRequest("Name is required");

                await _User.CreateUserAsync(dto);
                return _apiResponse.Ok("User created successfully");
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async ValueTask<IActionResult> GetUserById(long id)
        {
            try
            {
                var entity = await _User.GetUserById(id);
                var dto = entity.ToMap<User, UserResponseDto>();
                return _apiResponse.Ok(dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpPut()]
        public async ValueTask<IActionResult> UpdateUser([FromBody] UserRequestDto dto)
        {
            try
            {
                if (dto.ID < 0 || string.IsNullOrEmpty(dto.UserName) || dto.Password == null)
                {
                    return _apiResponse.BadRequest("Fields are required");
                }
                await _User.UpdateUserByIdAsync(dto);

                return _apiResponse.Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> DeleteUser(long id)
        {
            try
            {
                if (id < 0)
                {
                    return _apiResponse.BadRequest("Id is mandatory");
                }
                await _User.DeleteUserById(id);

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAllUser(string? searchkeyword)
        {
            var results = await _User.GetAllUser();

            if (!string.IsNullOrEmpty(searchkeyword))
            {
                searchkeyword = searchkeyword.ToLower();
                results = results.Where(x => x.UserName.ToLower().Contains(searchkeyword) ||
                x.Email.ToLower().Contains(searchkeyword) || x.MobileNumber.ToString().Contains(searchkeyword)
                ).ToList();
            }

            var dtos = results.ToMap<List<User>, List<UserResponseDto>>();

            return _apiResponse.Ok(dtos);
        }

    }
}
