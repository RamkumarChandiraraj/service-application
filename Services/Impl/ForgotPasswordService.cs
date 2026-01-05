using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using System.Security.Cryptography;
using System.Text;

public class ForgotPasswordService : IForgotPasswordService
{
    private readonly IRepositary<User> _userRepo;
    private readonly IRepositary<ForgotPasswordOtp> _otpRepo;
    private readonly IEmailService _emailService;

    public ForgotPasswordService(
        IRepositary<User> userRepo,
        IRepositary<ForgotPasswordOtp> otpRepo,
        IEmailService emailService)
    {
        _userRepo = userRepo;
        _otpRepo = otpRepo;
        _emailService = emailService;
    }

    public async Task<ApiResponseDto> SendOtpAsync(ForgotPasswordRequestDto request)
    {
        var user = _userRepo.FindByCondition(x =>
            x.UserName == request.UserNameOrEmail ||
            x.Email == request.UserNameOrEmail)
            .FirstOrDefault();

        if (user == null)
            return new ApiResponseDto { Success = false, Message = "User not found" };

        var otp = new Random().Next(100000, 999999).ToString();

        await _otpRepo.CreateAsync(new ForgotPasswordOtp
        {
            UserId = user.ID,
            Otp = otp,
            ExpiresAt = DateTime.UtcNow.AddMinutes(5),
            IsUsed = false
        });

        await _emailService.SendAsync(
            user.Email,
            "Password Reset OTP",
            $"Your OTP is {otp}. It expires in 5 minutes.");

        return new ApiResponseDto
        {
            Success = true,
            Message = "OTP sent to registered email"
        };
    }

    public async Task<ApiResponseDto> ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var user = _userRepo.FindByCondition(x =>
            x.UserName == request.UserNameOrEmail ||
            x.Email == request.UserNameOrEmail)
            .FirstOrDefault();

        if (user == null)
            return new ApiResponseDto { Success = false, Message = "User not found" };

        var otpEntity = _otpRepo.FindByCondition(x =>
            x.UserId == user.ID &&
            x.Otp == request.Otp &&
            !x.IsUsed &&
            x.ExpiresAt > DateTime.UtcNow)
            .FirstOrDefault();

        if (otpEntity == null)
            return new ApiResponseDto { Success = false, Message = "Invalid or expired OTP" };

        user.Password = HashPassword(request.NewPassword);
        await _userRepo.UpdateAsync(user);

        otpEntity.IsUsed = true;
        await _otpRepo.UpdateAsync(otpEntity);

        return new ApiResponseDto
        {
            Success = true,
            Message = "Password reset successful"
        };
    }

    private string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        return Convert.ToBase64String(
            sha.ComputeHash(Encoding.UTF8.GetBytes(password)));
    }
}
