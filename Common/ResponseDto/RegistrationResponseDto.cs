using Common.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.ResponseDto
{
    public class RegistrationResponseDto : BaseDto
    {
        public long ID { get; set; }

        public string CompanyName { get; set; }

        public string Location { get; set; }   // enum → string
        public string Services { get; set; }   // enum → string

        public string Email { get; set; }
        public long PhoneNumber { get; set; }
        public string Description { get; set; }
    }
}
