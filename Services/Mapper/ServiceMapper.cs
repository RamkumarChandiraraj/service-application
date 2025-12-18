using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Mapster;

namespace Services.Mapper
{
    public class ServicesMapper : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<ServiceRequestDto, Service>();
            config.NewConfig<Service, ServiceResponseDto>();
            config.NewConfig<List<ServiceRequestDto>, List<Service>>();
            config.NewConfig<List<Service>, List<ServiceResponseDto>>();
        }
    }
}
