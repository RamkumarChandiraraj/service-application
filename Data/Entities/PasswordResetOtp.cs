using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities
{
    [Table("forgot_password_otps")]
    public class ForgotPasswordOtp
    {
        [Key]
        public long Id { get; set; }

        public long UserId { get; set; }

        public string Otp { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
    }
}
