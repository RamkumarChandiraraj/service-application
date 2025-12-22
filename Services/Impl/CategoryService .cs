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

        public async ValueTask CreateCategoryAsync(CategoryRequestDto dto)
        {
            var entity = dto.ToMap<CategoryRequestDto, Category>();
            await _repository.CreateAsync(entity);
        }

        public async ValueTask<Category> GetCategoryByIdAsync(long id)
        {
            var entity = await _repository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                throw new Exception("Category not found");

            return entity;
        }

        public async ValueTask<List<Category>> GetCategoryAllAsync()
        {
            return await _repository
                .FindAll()
                .OrderByDescending(x => x.ID)
                .ToListAsync();
        }

        public async ValueTask UpdateCategoryAsync(CategoryRequestDto dto)
        {
            var entity = await GetCategoryByIdAsync(dto.ID);

            entity.Name = dto.Name;
            entity.Description = dto.Description;

            await _repository.UpdateAsync(entity);
        }

        public async ValueTask DeleteCategoryAsync(long id)
        {
            var entity = await GetCategoryByIdAsync(id);
            await _repository.DeleteAsync(entity);
        }
    }
}
