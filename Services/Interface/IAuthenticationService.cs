using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Common.RequestDto;
using Common.ResponseDto;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IAuthenticationService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    }

}
