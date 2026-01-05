using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Mapper
{
    public static class ForgotPasswordMapper
    {
        public static ForgotPasswordOtp ToOtpEntity(long userId, string otp)
        {
            return new ForgotPasswordOtp
            {
                UserId = userId,
                Otp = otp,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5),
                IsUsed = false
            };
        }
    }
}
