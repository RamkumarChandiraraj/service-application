using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.RequestDto;
using Common.ResponseDto;

namespace Server.Interfaces
{
    public interface IForgotPasswordService
    {
        Task<ApiResponse> SendOtpAsync(ForgotPasswordRequestDto request);
        Task<ApiResponse> ResetPasswordAsync(ResetPasswordRequestDto request);
    }
}
