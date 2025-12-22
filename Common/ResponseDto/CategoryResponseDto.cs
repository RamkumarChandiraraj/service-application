using Common.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Common.ResponseDto
{
    public class CategoryResponseDto : BaseDto
    {
        public long ID { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
