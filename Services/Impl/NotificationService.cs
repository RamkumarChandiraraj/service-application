using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using FirebaseAdmin.Messaging;
using Services.Interface;

namespace Services.Impl
{
    public class NotificationService(
        IRepositary<UserDevice> userDeviceRepository
    ) : INotificationService
    {
        private readonly IRepositary<UserDevice> _repo = userDeviceRepository;

        public async ValueTask RegisterTokenAsync(FcmTokenRequestDto dto)
        {
            var exists = _repo
                .FindByCondition(x => x.FcmToken == dto.FcmToken)
                ?.FirstOrDefault();

            if (exists != null)
                return;

            var device = new UserDevice
            {
                UserId = dto.UserId,
                FcmToken = dto.FcmToken,
                IsActive = true
            };

            device.GenerateCreateHistory(dto.UserId);
            await _repo.CreateAsync(device);
        }

        public async ValueTask<NotificationResponseDto> SendAsync(NotificationRequestDto req)
        {
            if (FirebaseMessaging.DefaultInstance == null)
            {
                throw new InvalidOperationException(
                    "Firebase is not initialized. Cannot send notifications."
                );
            }

            var query = _repo.FindAll() ?? Enumerable.Empty<UserDevice>().AsQueryable();

            if (req.SendToActiveUsers)
                query = query.Where(x => x.IsActive);

            var tokens = query
                .Select(x => x.FcmToken)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Distinct()
                .ToList();

            if (tokens.Count == 0)
                return new NotificationResponseDto();

            var message = new MulticastMessage
            {
                Tokens = tokens,
                Notification = new Notification
                {
                    Title = req.Title,
                    Body = req.Body
                }
            };

            var result =
                await FirebaseMessaging.DefaultInstance
                    .SendEachForMulticastAsync(message);

            return new NotificationResponseDto
            {
                TotalUsers = tokens.Count,
                SuccessCount = result.SuccessCount,
                FailureCount = result.FailureCount
            };
        }
    }
}
