using Common.Base;

namespace Common.RequestDto
{
    public class LocationRequestDto : BaseDto
    {
        public string Name { get; set; }   // Electrician, Two Wheeler

        public string? Description { get; set; }

        public string? LocationCode { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public int Pincode { get; set; }

        public long? ReferenceId { get; set; }
    }
}
