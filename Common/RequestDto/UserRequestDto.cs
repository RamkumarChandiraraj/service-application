using Common.Base;
using Common.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Common.RequestDto
{
    public class UserRequestDto : BaseDto
    {
        public long ID { get; set; }
        public string UserName { get; set; }
        public string? Password { get; set; }
        public string Email { get; set; }
        public long MobileNumber { get; set; }
        public UserRole Role { get; set; }
        public long? ProfileId { get; set; }
    }
}
