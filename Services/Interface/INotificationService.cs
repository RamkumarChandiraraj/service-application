using Common.RequestDto;
using Common.ResponseDto;

namespace Services.Interface
{
    public interface INotificationService
    {
        ValueTask RegisterTokenAsync(FcmTokenRequestDto dto);
        ValueTask<NotificationResponseDto> SendAsync(NotificationRequestDto dto);
    }
}
