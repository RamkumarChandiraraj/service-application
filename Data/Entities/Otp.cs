using Data.BaseEntity;
using System;
using System.ComponentModel.DataAnnotations;

namespace Data.Entities
{
    public class Otp : BaseEntityModel
    {
        [Key]
        public override long ID { get; set; }

        public long UserId { get; set; }

        public string? Email { get; set; }
        public string? Mobile { get; set; }

        public string OtpValue { get; set; }

        public DateTime ExpiryTime { get; set; }

        public bool IsUsed { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
