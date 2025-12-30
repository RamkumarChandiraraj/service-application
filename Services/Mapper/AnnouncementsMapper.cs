using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Mapster;

namespace Services.Mapper
{
    public class AnnouncementsMapper : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<AnnouncementsRequestDto, Announcements>();
            config.NewConfig<Announcements, AnnouncementsResponseDto>();
            config.NewConfig<List<AnnouncementsRequestDto>, List<Announcements>>();
            config.NewConfig<List<Announcements>, List<AnnouncementsResponseDto>>();
        }
    }
}
