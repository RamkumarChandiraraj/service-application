using Common;
using Common.Extension;
using Common.RequestDto;
using Common.Settings;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Services.Interface;

namespace Services.Impl
{
    public class CategoryService(
        IRepositary<Category> repository,
        IMemoryCache memoryCache,
        ICacheSettings cacheSettings
    ) : ICategoryService
    {
        private readonly IRepositary<Category> _repository = repository;
        private readonly IMemoryCache _cache = memoryCache;
        private readonly ICacheSettings _cacheSettings = cacheSettings;

        public async ValueTask<Category> CreateCategoryAsync(CategoryRequestDto dto)
        {
            try
            {
                var entity = dto.ToMap<CategoryRequestDto, Category>();
                await _repository.CreateAsync(entity);

                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.CategoryAll);

                return entity;
            }
            catch
            {
                throw;
            }
        }

        public async ValueTask<Category?> GetCategoryByIdAsync(long id)
        {
            try
            {
                List<Category> categories;

                // 1️⃣ Try cache first
                if (!_cache.TryGetValue(CacheKeys.CategoryAll, out categories))
                {
                    // 2️⃣ Cache miss → DB
                    categories = await _repository
                        .FindAll()
                        .OrderBy(x => x.ID)
                        .ToListAsync();

                    // 3️⃣ Store in cache
                    _cache.Set(
                        CacheKeys.CategoryAll,
                        categories,
                        new MemoryCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow =
                                TimeSpan.FromMinutes(_cacheSettings.AbsoluteExpirationMinutes),

                            SlidingExpiration =
                                TimeSpan.FromMinutes(_cacheSettings.SlidingExpirationMinutes)
                        });
                }
                // 4️⃣ Find service by ID from cached list
                var category = categories.FirstOrDefault(c => c.ID == id);

                if (category == null)
                {
                    throw new InvalidDataException($"Id '{id}' not exists.");
                }

                return category;
            }
            catch
            {
                throw;
            }
        }

        public async ValueTask<List<Category>> GetCategoryAllAsync()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.CategoryAll, out List<Category> cachedCategories))
                {
                    return cachedCategories; // ✅ CACHE HIT
                }

                var categories = await _repository
                    .FindAll()
                    .OrderBy(x => x.ID)
                    .ToListAsync();

                _cache.Set(
                    CacheKeys.CategoryAll,
                    categories,
                    new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow =
                            TimeSpan.FromMinutes(_cacheSettings.AbsoluteExpirationMinutes),

                        SlidingExpiration =
                            TimeSpan.FromMinutes(_cacheSettings.SlidingExpirationMinutes)
                    });

                return categories;
            }
            catch
            {
                throw;
            }
        }

        public async ValueTask<bool> UpdateCategoryByIdAsync(CategoryRequestDto dto)
        {
            try
            {
                var entity = await GetCategoryByIdAsync(dto.ID);
                if (entity == null) return false;

                entity.Name = dto.Name;
                entity.Icon = dto.Icon;
                entity.Link = dto.Link;
                entity.Description = dto.Description;

                await _repository.UpdateAsync(entity);

                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.CategoryAll);

                return true;
            }
            catch
            {
                throw;
            }
        }

        public async ValueTask<bool> DeleteCategoryByIdAsync(long id)
        {
            try
            {
                var entity = await GetCategoryByIdAsync(id);
                if (entity == null) return false;

                await _repository.DeleteAsync(entity);

                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.CategoryAll);

                return true;
            }
            catch
            {
                throw;
            }
        }
    }
}
