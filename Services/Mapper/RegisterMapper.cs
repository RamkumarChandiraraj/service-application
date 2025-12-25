using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Mapster;
using MapsterMapper;
using Services.Mapper;

namespace Services.Mappings;

public static class RegisterMapper
{
    public static void RegisterMapsterConfiguration()
    {
        TypeAdapterConfig.GlobalSettings.Apply(
            new ServicesMapper(),
            new CategoryMapper(),
            new UserMapper()            
            );
     
    }
}
