using Data.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class Registration : BaseEntityModel
    {
       
            [Key]
            public override long ID { get; set; }
            public string CompanyName { get; set; }
            public long LocationId { get; set; }
            [ForeignKey(nameof(LocationId))]
            public virtual Location Location { get; set; }
            public long ServiceId { get; set; }
            [ForeignKey(nameof(ServiceId))]
            public virtual Service Service { get; set; }
            public string Email { get; set; }

            public long PhoneNumber { get; set; }
            public string Description { get; set; }

            public double Latitude { get; set; }

            public double Longitude { get; set; }
        
            public long? ProfileImageId { get; set; }
        
       
        [ForeignKey("ProfileImageId")]
        public virtual Attachment ProfileImage { get; set; }

    }
    }

