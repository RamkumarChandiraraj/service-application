
using Common.RequestDto;
using Common.ResponseDto;

namespace Services.Interface
{
    public interface IUserSearchService
    {
        ValueTask<List<UserSearchResponseDto>> SearchUsersAsync(UserSearchRequestDto dto);
    }
}
