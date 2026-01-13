using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Impl;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService user, IApiMessage<IApiResponse> apiResponse,ILogger<UserController> logger) : ControllerBase
    {
      
        private readonly IUserService _User = user;
        private readonly IApiMessage<IApiResponse> _apiResponse = apiResponse;
        private readonly ILogger<UserController> _logger = logger;
        //public UserController(ILogger<UserController> logger)
        //{
        //    _Logger = logger;
        //}

        [HttpPost]
        public async ValueTask<IActionResult> CreateUser(UserRequestDto dto)
        {
            try
            {
                _logger.LogDebug("");


                if (string.IsNullOrEmpty(dto.UserName))
                    return _apiResponse.BadRequest("Name is required");


                var isDuplicate = await _User.IsDuplicateAsync(dto.Email,dto.UserName, dto.MobileNumber);



                if (isDuplicate)
                {
                    return _apiResponse.BadRequest("Email, UserName, or Mobile number already exists");
                }

                // No duplicates, create user
                await _User.CreateUserAsync(dto);
                return _apiResponse.Ok("User created successfully");
            }
            catch (Exception ex)
            {
               
              _logger.LogError(ex.Message);
               return _apiResponse.InternalServerError(ex.Message);
            }

        }


        [HttpGet("{id}")]
        public async ValueTask<IActionResult> GetUserById(long id)
        {
            
            try
            { 
                
                var entity = await _User
                    .GetUserById(id);
                var dto = entity.ToMap<User, UserResponseDto>();
                return _apiResponse.Ok(dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }
        [Authorize]
        [HttpPut("{id}")]

        public async ValueTask<IActionResult> UpdateUser(int id, [FromBody] UserRequestDto dto)
        {
            try
            {
                if (dto.ID != id || string.IsNullOrEmpty(dto.UserName) )
                    return _apiResponse.BadRequest("Fields are required or ID mismatch");

                
                var isDuplicate = await _User.IsDuplicateAsync(
                    dto.Email,
                    dto.UserName,
                    dto.MobileNumber,
                    (int?)dto.ID 
                );

                if (isDuplicate)
                    return _apiResponse.BadRequest("Email, UserName or Mobile number already exists");

                await _User.UpdateUserByIdAsync(dto);

                return _apiResponse.Ok("User updated successfully");
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
            }

        [Authorize]
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
        [Authorize]
        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAllUser(string? searchkeyword)
        {
            try
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
            catch (Exception ex)
            {
                 _logger.LogError(ex.Message);
                return _apiResponse.Ok();
            }
        }

    }
}
