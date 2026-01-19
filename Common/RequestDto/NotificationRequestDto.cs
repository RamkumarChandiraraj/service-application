using Common.Base;
using System.ComponentModel.DataAnnotations;

namespace Common.RequestDto
{
    public class NotificationRequestDto : BaseDto
    {
        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Body { get; set; }

        public bool SendToAll { get; set; }
        public bool SendToActiveUsers { get; set; }
    }
}
