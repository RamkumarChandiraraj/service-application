using Common.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.ResponseDto
{
    public class ServiceResponseDto : BaseDto
    {
        public string Name { get; set; }   // Electrician, Two Wheeler

        public string? Description { get; set; }

        public string? Icon { get; set; }

        public long CategoryId { get; set; }

        // Optional: useful for UI display
        public string? CategoryName { get; set; }
    }
}
