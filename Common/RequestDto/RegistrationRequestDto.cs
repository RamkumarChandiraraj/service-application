using Common.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.RequestDto
{
    public class RegistrationRequestDto : BaseDto
    {
        public readonly string ServicesId;

        public string CompanyName { get; set; }


        public long LocationId { get; set; }


        public long ServiceId { get; set; }


        public string Email { get; set; }


        public long PhoneNumber { get; set; }

        public string Description { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
