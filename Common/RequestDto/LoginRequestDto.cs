using Common.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.RequestDto
{
    public class LoginRequestDto
    {
        public required string UserNameOrEmail { get; set; }
        public string Password { get; set; }
    }

}
