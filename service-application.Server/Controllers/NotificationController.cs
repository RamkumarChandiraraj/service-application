using Common.Base;
using Common.BaseResponse;
using Common.RequestDto;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController(
        INotificationService notification,
        IApiMessage<IApiResponse> apiResponse
    ) : ControllerBase
    {
        private readonly INotificationService _notification = notification;
        private readonly IApiMessage<IApiResponse> _apiResponse = apiResponse;

        // 🔔 REGISTER TOKEN
        [HttpPost("register-token")]
        public async ValueTask<IActionResult> RegisterToken(
            [FromBody] FcmTokenRequestDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FcmToken))
                return _apiResponse.BadRequest("FCM token required");

            await _notification.RegisterTokenAsync(dto);
            return _apiResponse.Ok(true);
        }

        // 🔔 SEND NOTIFICATION
        [HttpPost("send")]
        public async ValueTask<IActionResult> Send(
            [FromBody] NotificationRequestDto dto)
        {
            var result = await _notification.SendAsync(dto);
            return _apiResponse.Ok(result);
        }
    }
}
