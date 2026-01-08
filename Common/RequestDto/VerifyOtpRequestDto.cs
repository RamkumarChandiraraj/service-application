using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.RequestDto
{
    public class VerifyOtpRequestDto
    {
        [Required]
        public string UserNameOrEmail { get; set; }

        [Required, StringLength(6)]
        public string Otp { get; set; }

        [Required, MinLength(6)]
        public string NewPassword { get; set; }
    }

}

