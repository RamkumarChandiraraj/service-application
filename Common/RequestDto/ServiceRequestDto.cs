using Common.Base;


namespace Common.RequestDto
{
    public class ServiceRequestDto : BaseDto
    {
        public string Name { get; set; }   // Electrician, Two Wheeler

        public string? Description { get; set; }
    }
}
