using Common.RequestDto;
using Common.ResponseDto;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IForgotPasswordService _forgotService;

    public AuthController(IForgotPasswordService forgotService)
    {
        _forgotService = forgotService;
    }

    // ================= SEND OTP =================
    [HttpPost("forgot-password")]
    public async Task<IActionResult> SendOtp([FromBody] ForgotPasswordRequestDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _forgotService.SendOtpAsync(dto);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        catch (Exception)
        {
            // TODO: log exception
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "Internal server error while sending OTP"
            });
        }
    }

    // ================= VERIFY OTP + RESET PASSWORD =================
    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequestDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _forgotService.VerifyOtpAsync(dto);

            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
        catch (Exception)
        {
            // TODO: log exception
            return StatusCode(500, new ApiResponse
            {
                Success = false,
                Message = "error while verifying OTP"
            });
        }
    }
}
