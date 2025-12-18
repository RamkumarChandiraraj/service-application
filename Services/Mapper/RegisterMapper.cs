using Mapster;
using MapsterMapper;
using Services.Mapper;

namespace Services.Mappings;

public static class RegisterMapper
{
    public static void RegisterMapsterConfiguration()
    {
        TypeAdapterConfig.GlobalSettings.Apply(
            new ServicesMapper()
            );
    }
}
