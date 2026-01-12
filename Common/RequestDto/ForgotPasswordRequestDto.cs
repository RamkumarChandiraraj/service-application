using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.RequestDto
{
    public class ForgotPasswordRequestDto
    {
         public required string UserNameOrEmail { get; set; }
    }
}
