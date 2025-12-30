using Common.Base;


namespace Common.RequestDto
{
    public class ServiceRequestDto : BaseDto
    {
        public string Name { get; set; }   // Electrician, Two Wheeler

        public string? Description { get; set; }

        public string? Icon { get; set; }

        public long CategoryId { get; set; }
    }
}
