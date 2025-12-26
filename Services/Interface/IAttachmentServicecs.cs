using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;

namespace Services.Interface
{
    public interface IAttachmentService
    {
        Task<Attachment> UploadAsync(AttachmentRequestDto dto);
        Task<AttachmentResponseDto?> GetByIdAsync(long id);
    }
}
