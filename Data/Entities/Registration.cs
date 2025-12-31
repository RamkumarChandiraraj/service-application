using Data.BaseEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
            public string Location { get; set; }
            public string Services { get; set; }
            public string Email { get; set; }

            public long PhoneNumber { get; set; }
            public string Description { get; set; }

            public double Latitude { get; set; }

            public double Longitude { get; set; }

    }
    }

