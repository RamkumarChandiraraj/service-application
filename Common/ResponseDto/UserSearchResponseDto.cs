
using Common.Base;

namespace Common.ResponseDto
{
    public class UserSearchResponseDto : BaseDto
    {
        public long UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public long MobileNumber { get; set; }
        public string CompanyName { get; set; }
        public double DistanceInKm { get; set; }
    }
}
