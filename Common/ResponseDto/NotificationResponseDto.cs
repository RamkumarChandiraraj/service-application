using Common.Base;

namespace Common.ResponseDto
{
    public class NotificationResponseDto : BaseDto
    {
        public int TotalUsers { get; set; }
        public int SuccessCount { get; set; }
        public int FailureCount { get; set; }
    }
}
