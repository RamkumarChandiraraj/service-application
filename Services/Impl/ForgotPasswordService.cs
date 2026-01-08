using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Services.Interface;
using Services.Impl; // 👈 Required for EmailTemplateReader
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Impl
{
    public class ForgotPasswordService : IForgotPasswordService
    {
        private readonly IRepositary<User> _userRepo;
        private readonly IRepositary<Otp> _otpRepo;
        private readonly IEmailService _emailService;

        public ForgotPasswordService(
            IRepositary<User> userRepo,
            IRepositary<Otp> otpRepo,
            IEmailService emailService)
        {
            _userRepo = userRepo;
            _otpRepo = otpRepo;
            _emailService = emailService;
        }

        // ================= SEND OTP =================
        public async Task<ApiResponse> SendOtpAsync(ForgotPasswordRequestDto request)
        {
            try
            {
                var user = _userRepo.FindByCondition(u =>
                    u.Email == request.UserNameOrEmail ||
                    u.UserName == request.UserNameOrEmail
                ).FirstOrDefault();

                if (user == null)
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };

                if (string.IsNullOrWhiteSpace(user.Email))
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User email is not registered"
                    };

                var otp = new Random().Next(100000, 999999).ToString();

                await _otpRepo.CreateAsync(new Otp
                {
                    UserId = user.ID,
                    Email = user.Email,
                    OtpValue = otp,
                    ExpiryTime = DateTime.UtcNow.AddMinutes(5),
                    IsUsed = false,
                    CreatedDate = DateTime.UtcNow
                });

                // ================= SEND OTP EMAIL =================
                var html = EmailTemplateReader.ReadTemplate("ForgotPasswordOtp.html");

                html = html
                    .Replace("{{UserName}}", user.UserName)
                    .Replace("{{OTP}}", otp);

                await _emailService.SendEmailAsync(
                    user.Email,
                    "Password Reset OTP",
                    html
                );
                // =================================================

                return new ApiResponse
                {
                    Success = true,
                    Message = "OTP sent successfully"
                };
            }
            catch (Exception)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Something went wrong while sending OTP"
                };
            }
        }

        // ================= VERIFY OTP & RESET PASSWORD =================
        public async Task<ApiResponse> VerifyOtpAsync(VerifyOtpRequestDto request)
        {
            try
            {
                // 1️⃣ Find user using username OR email
                var user = _userRepo.FindByCondition(u =>
                    u.Email == request.UserNameOrEmail ||
                    u.UserName == request.UserNameOrEmail
                ).FirstOrDefault();


                if (user == null)
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid or expired OTP"
                    };

                var otpEntry = _otpRepo.FindByCondition(o =>
                          o.UserId == user.ID &&
                          o.OtpValue == request.Otp &&
                          !o.IsUsed &&
                          o.ExpiryTime > DateTime.UtcNow
                      ).FirstOrDefault();

                if (user == null)
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };

                // 🔐 Update password (logic unchanged)
                user.Password = request.NewPassword;
                await _userRepo.UpdateAsync(user);

                otpEntry.IsUsed = true;
                await _otpRepo.UpdateAsync(otpEntry);

                // ================= SEND PASSWORD RESET SUCCESS EMAIL =================
                var successHtml = EmailTemplateReader.ReadTemplate("PasswordResetSuccess.html");

                successHtml = successHtml
                    .Replace("{{UserName}}", user.UserName)
                    .Replace("{{Year}}", DateTime.UtcNow.Year.ToString());

                await _emailService.SendEmailAsync(
                    user.Email,
                    "Your Password Has Been Reset",
                    successHtml
                );
                // =====================================================================

                return new ApiResponse
                {
                    Success = true,
                    Message = "Password updated successfully"
                };
            }
            catch (Exception)
            {
                return new ApiResponse
                {
                    Success = false,
                    Message = "Something went wrong while verifying OTP"
                };
            }
        }
    }
}
