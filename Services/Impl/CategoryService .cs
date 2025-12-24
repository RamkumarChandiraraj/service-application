using Common.Extension;
using Common.RequestDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Services.Interface;

namespace Services.Impl
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepositary<Category> _repository;

        public CategoryService(IRepositary<Category> repository)
        {
            _repository = repository;
        }

        public async ValueTask<Category> CreateCategoryAsync(CategoryRequestDto dto)
        {
            var entity = dto.ToMap<CategoryRequestDto, Category>();
            await _repository.CreateAsync(entity);
            return entity;
        }

        public async ValueTask<Category?> GetCategoryByIdAsync(long id)
        {
            return await _repository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();
        }

        public async ValueTask<List<Category>> GetCategoryAllAsync()
        {
            return await _repository
                .FindAll()
                .OrderByDescending(x => x.ID)
                .ToListAsync();
        }

        public async ValueTask<bool> UpdateCategoryByIdAsync(CategoryRequestDto dto)
        {
            var entity = await GetCategoryByIdAsync(dto.ID);
            if (entity == null) return false;

            entity.Name = dto.Name;
            entity.Description = dto.Description;

            await _repository.UpdateAsync(entity);
            return true;
        }

        public async ValueTask<bool> DeleteCategoryByIdAsync(long id)
        {
            var entity = await GetCategoryByIdAsync(id);
            if (entity == null) return false;

            await _repository.DeleteAsync(entity);
            return true;
        }
    }
}
