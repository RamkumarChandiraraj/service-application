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

        public long LocationId { get; set; }   
        public long ServiceId { get; set; }   

        public string Email { get; set; }
        public long PhoneNumber { get; set; }
        public string Description { get; set; }
        public double Latitude { get; set; }   
        public double Longitude { get; set; }
        public long? ProfileImageId { get; set; }
        public string ProfileImageUrl { get; set; }
    }
}
