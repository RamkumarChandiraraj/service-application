using Common.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.RequestDto
{
    public class AnnouncementsRequestDto:BaseDto
    { 
        public string? Title { get; set; } 
        public string? Description { get; set; }
    }
}
