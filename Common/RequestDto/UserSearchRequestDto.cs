
using Common.Base;

namespace Common.RequestDto
{
    public class UserSearchRequestDto : BaseDto
    {
        public List<long> CategoryIds { get; set; }
        public List<long> ServiceIds { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
    }
}
