using Common.Base;

namespace Common.RequestDto
{
    public class FcmTokenRequestDto
    {
        public required string FcmToken { get; set; }
        public long UserId { get; set; }
    }
}
