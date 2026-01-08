using Common.Enum;
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
     public class User : BaseEntityModel
     {
        [Key]
        public override long ID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public long MobileNumber { get; set; }
        public UserRole Role { get; set; }
        public long? ProfileId { get; set; }

        [ForeignKey(nameof(ProfileId))]
        public virtual Attachment Profile { get; set; }

    }

}
