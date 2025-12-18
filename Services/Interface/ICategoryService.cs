using Common.RequestDto;
using Data.Entities;

namespace Services.Interface
{
    public interface ICategoryService
    {
        ValueTask CreateCategoryAsync(CategoryRequestDto dto);
        ValueTask<Category> GetCategoryByIdAsync(long id);
        ValueTask<List<Category>> GetCategoryAllAsync();
        ValueTask UpdateCategoryAsync(CategoryRequestDto dto);
        ValueTask DeleteCategoryAsync(long id);
    }
}
