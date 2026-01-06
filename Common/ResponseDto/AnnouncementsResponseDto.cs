using Common.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.ResponseDto
{
    public class AnnouncementsResponseDto: BaseDto 
    {
        public string? Title { get; set; }

        public string? Description { get; set; }
    }
}
