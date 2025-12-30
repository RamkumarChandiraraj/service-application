using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;

public interface IAttachmentService
{
    Task<Attachment> UploadAsync(AttachmentRequestDto dto);
    Task<List<AttachmentResponseDto>> GetAllAsync(); 
    Task<AttachmentResponseDto?> GetByIdAsync(long id);
    Task<bool> DeleteAsync(long id);
    Task<bool> UpdateAsync(long id, AttachmentRequestDto dto);
}
