using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Services.Interface;
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

                await _emailService.SendEmailAsync(
                    user.Email,
                    "Password Reset OTP",
                    $"Your OTP is {otp}. It is valid for 5 minutes."
                );

                return new ApiResponse
                {
                    Success = true,
                    Message = "OTP sent successfully"
                };
            }
            catch (Exception ex)
            {
                // TODO: log exception (Serilog / NLog / ILogger)
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
                var otpEntry = _otpRepo.FindByCondition(o =>
                    o.Email == request.Email &&
                    o.OtpValue == request.Otp &&
                    !o.IsUsed &&
                    o.ExpiryTime > DateTime.UtcNow
                ).FirstOrDefault();

                if (otpEntry == null)
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid or expired OTP"
                    };

                var user = _userRepo
                    .FindByCondition(u => u.ID == otpEntry.UserId)
                    .FirstOrDefault();

                if (user == null)
                    return new ApiResponse
                    {
                        Success = false,
                        Message = "User not found"
                    };

                // 🔐 IMPORTANT: Hash password here (do NOT store plain text)
                user.Password = request.NewPassword;
                await _userRepo.UpdateAsync(user);

                otpEntry.IsUsed = true;
                await _otpRepo.UpdateAsync(otpEntry);

                return new ApiResponse
                {
                    Success = true,
                    Message = "Password updated successfully"
                };
            }
            catch (Exception ex)
            {
                // TODO: log exception
                return new ApiResponse
                {
                    Success = false,
                    Message = "Something went wrong while verifying OTP"
                };
            }
        }
    }
}
