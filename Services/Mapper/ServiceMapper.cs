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
            // Request DTO → Entity
            config.NewConfig<ServiceRequestDto, Service>()
                .Map(dest => dest.CategoryId, src => src.CategoryId);

            // Entity → Response DTO
            config.NewConfig<Service, ServiceResponseDto>()
                .Map(dest => dest.CategoryId, src => src.CategoryId)
                .Map(dest => dest.CategoryName, src => src.Category != null ? src.Category.Name : null);

            config.NewConfig<List<ServiceRequestDto>, List<Service>>();
            config.NewConfig<List<Service>, List<ServiceResponseDto>>();
        }
    }
}
