using Common.RequestDto;
using Common.ResponseDto;

namespace Services.Interface
{
    public interface IAnnouncementsService
    {
        // CREATE
        ValueTask<AnnouncementsResponseDto> CreateAsync(AnnouncementsRequestDto dto);

        // READ BY ID
        ValueTask<AnnouncementsResponseDto?> GetByIdAsync(long id);

        // READ ALL
        ValueTask<List<AnnouncementsResponseDto>> GetAllAsync();

        // UPDATE
        ValueTask<bool> UpdateByIdAsync(long id, AnnouncementsRequestDto dto);

        // DELETE
        ValueTask<bool> DeleteByIdAsync(long id);
    }
}
