using Common.RequestDto;
using Common.ResponseDto;

namespace Services.Interface
{
    public interface IAnnouncementsService
    {
        Task<AnnouncementsResponseDto> CreateAsync(AnnouncementsRequestDto dto);

        Task<AnnouncementsResponseDto?> GetByIdAsync(long id);

        Task<List<AnnouncementsResponseDto>> GetAllAsync();

        Task<bool> UpdateAsync(long id, AnnouncementsRequestDto dto);

        Task<bool> DeleteAsync(long id);
    }
}
