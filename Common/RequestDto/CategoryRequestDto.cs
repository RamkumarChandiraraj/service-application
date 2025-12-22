using Common.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.RequestDto
{
    public class CategoryRequestDto : BaseDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}
