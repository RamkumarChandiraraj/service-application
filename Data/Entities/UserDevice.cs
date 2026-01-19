using Data.BaseEntity;
using System.ComponentModel.DataAnnotations;

namespace Data.Entities
{
    public class UserDevice : BaseEntityModel
    {
        [Key]
        public override long ID { get; set; }

        public long UserId { get; set; }

        [Required]
        public required string FcmToken { get; set; }

        public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
    }
}
