using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Mapster;

namespace Services.Mapper
{
    public class CategoryMapper : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<CategoryRequestDto, Category>();
            config.NewConfig<Category, CategoryResponseDto>();
            config.NewConfig<List<CategoryRequestDto>, List<Category>>();
            config.NewConfig<List<Category>, List<CategoryResponseDto>>();
        }
    }
}
