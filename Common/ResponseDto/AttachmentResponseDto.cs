using Common.Base;

namespace Common.ResponseDto
{
    public class AttachmentResponseDto : BaseDto
    {
        public string FileName { get; set; } = null!;
        public string FilePath { get; set; } = null!;
    }
}
