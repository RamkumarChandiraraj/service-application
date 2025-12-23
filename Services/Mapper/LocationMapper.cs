using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Mapster;

namespace Services.Mapper
{
    public class LocationMapper : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<LocationRequestDto, Service>();
            config.NewConfig<Location, LocationResponseDto>();
            config.NewConfig<List<LocationRequestDto>, List<Location>>();
            config.NewConfig<List<Location>, List<LocationResponseDto>>();
        }
    }
}
