using Common.RequestDto;
using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interface
{
    public interface IUserService
    {
        ValueTask<User> CreateUserAsync(UserRequestDto req);
        ValueTask<User> GetUserById(long id);
        ValueTask UpdateUserByIdAsync(UserRequestDto req);
        ValueTask DeleteUserById(long id);
        ValueTask<List<User>> GetAllUser();
    }
}
