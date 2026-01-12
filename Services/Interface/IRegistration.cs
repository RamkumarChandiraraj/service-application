using Common.RequestDto;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IRegistrationService
    {
        Task<bool> EmailExists(string email);
        Task<bool> PhoneNumberExists(long phoneNumber);
        ValueTask<IActionResult> Create(RegistrationRequestDto dto);
        ValueTask<IActionResult> Get(long id);
        ValueTask<IActionResult> GetAll();
        ValueTask<IActionResult> Update(long id, RegistrationRequestDto dto);
        ValueTask<IActionResult> Delete(long id);
    }
    }
