using Common.RequestDto;
using Common.ResponseDto;
using Data.Context;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Crypto.Generators;
using System;
using System.Net;
using System.Net.Mail;

namespace service_application.Server.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ServiceApplicationDbContext _context;

        public AuthController(ServiceApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequestDto request)
        {
            var user = await _context.User
                .FirstOrDefaultAsync(x =>
                    x.Email == request.UserNameOrEmail ||
                    x.UserName == request.UserNameOrEmail);

            if (user == null)
                return Ok(new ApiResponseDto
                {
                    Success = true,
                    Message = "If account exists, OTP sent to registered email"
                });

            var otp = new Random().Next(100000, 999999).ToString();

            var otpEntity = new PasswordResetOtp
            {
                UserId = user.ID,
                Otp = otp,
                ExpiryTime = DateTime.UtcNow.AddMinutes(10),
                IsUsed = false
            };

            _context.PasswordResetOtps.Add(otpEntity);
            await _context.SaveChangesAsync();

            // TODO: Send Email
            SendOtpEmail(user.Email, otp);

            return Ok(new ApiResponseDto
            {
                Success = true,
                Message = "OTP sent to registered email"
            });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto request)
        {
            var user = await _context.User
                .FirstOrDefaultAsync(x =>
                    x.Email == request.UserNameOrEmail ||
                    x.UserName == request.UserNameOrEmail);

            if (user == null)
                return BadRequest("Invalid user");

            var otpEntry = await _context.PasswordResetOtps
                .Where(x => x.UserId == user.ID && !x.IsUsed && x.ExpiryTime > DateTime.UtcNow)
                .OrderByDescending(x => x.CreatedOn)
                .FirstOrDefaultAsync();

            if (otpEntry == null || otpEntry.Otp != request.Otp)
                return BadRequest("Invalid or expired OTP");

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            otpEntry.IsUsed = true;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponseDto
            {
                Success = true,
                Message = "Password reset successful"
            });
        }

        private void SendOtpEmail(string email, string otp)
        {
            var message = new MailMessage("noreply@app.com", email)
            {
                Subject = "Password Reset OTP",
                Body = $"Your OTP is {otp}. Valid for 10 minutes."
            };

            using var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential("your@gmail.com", "app-password"),
                EnableSsl = true
            };

            smtp.Send(message);
        }



    }
}

