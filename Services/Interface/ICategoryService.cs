using Common.RequestDto;
using Data.Entities;

namespace Services.Interface
{
    public interface ICategoryService
    {
        ValueTask<Category> CreateCategoryAsync(CategoryRequestDto dto);
        ValueTask<Category?> GetCategoryByIdAsync(long id);
        ValueTask<List<Category>> GetCategoryAllAsync();
        ValueTask<bool> UpdateCategoryByIdAsync(CategoryRequestDto dto);
        ValueTask<bool> DeleteCategoryByIdAsync(long id);
    }
}
