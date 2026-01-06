
using Common.Base;

namespace Common.ResponseDto
{
    public class UserSearchResponseDto : BaseDto
    {
        public string CompanyName { get; set; }
        public string Description { get; set; }
        public long LocationId { get; set; }
        public string LocationName { get; set; }
        public long ServiceId { get; set; }
        public string ServiceName { get; set; }
    }
}
