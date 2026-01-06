using Data.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class Announcements : BaseEntityModel 
    {

        [Key]
        public override long ID { get; set; }

        public string? Title { get; set; } 

        public string? Description { get; set; }
    }
}
