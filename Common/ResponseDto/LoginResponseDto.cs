using Common.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.ResponseDto
{
    public class LoginResponseDto
    {
            public string Token { get; set; }
            public long UserId { get; set; }
            public string UserName { get; set; }
            public string Role { get; set; }
    }
}
