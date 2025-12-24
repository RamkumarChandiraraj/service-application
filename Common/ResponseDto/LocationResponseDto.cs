using Common.Base;

namespace Common.ResponseDto
{
    public class LocationResponseDto : BaseDto
    {
        public long ID { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public string? LocationCode { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public int Pincode { get; set; }

        public long? ReferenceId { get; set; }
    }
}
