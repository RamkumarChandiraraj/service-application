using Common;
using Common.Extension;
using Common.RequestDto;
using Common.Settings;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Org.BouncyCastle.Ocsp;
using Services.Interface;

namespace Services.Impl
{
    public class ServiceService(IRepositary<Service> serviceRepository, IMemoryCache memoryCache, ICacheSettings cacheSettings) : IServiceService
    {
        private readonly IRepositary<Service> _serviceRespository = serviceRepository;

        private readonly IMemoryCache _cache = memoryCache;

        private readonly ICacheSettings _cacheSettings = cacheSettings;

        public async ValueTask<Service> CreateServiceAsync(ServiceRequestDto req)
        {
            try
            {
                var entity = req.ToMap<ServiceRequestDto, Service>();

                entity.GenerateCreateHistory(1);
                await _serviceRespository.CreateAsync(entity);
                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.ServiceAll);
                return entity;

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async ValueTask<Service> GetServiceById(long id)
        {
            try
            {
                List<Service> services;

                // 1️⃣ Try to get all services from cache
                if (!_cache.TryGetValue(CacheKeys.ServiceAll, out services))
                {
                    // 2️⃣ Cache miss → fetch from DB
                    services = await _serviceRespository
                        .FindAll()
                        .Include(x => x.Category)
                        .ToListAsync();

                    // 3️⃣ Set cache using CacheSettings
                    _cache.Set(
                        CacheKeys.ServiceAll,
                        services,
                        new MemoryCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow =
                                TimeSpan.FromMinutes(_cacheSettings.AbsoluteExpirationMinutes),

                            SlidingExpiration =
                                TimeSpan.FromMinutes(_cacheSettings.SlidingExpirationMinutes)
                        });
                }

                // 4️⃣ Find service by ID from cached list
                var service = services.FirstOrDefault(s => s.ID == id);

                if (service == null)
                {
                    throw new InvalidDataException($"Id '{id}' not exists.");
                }

                return service;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async ValueTask UpdateServiceByIdAsync(ServiceRequestDto req)
        {
            try
            {
                var oldEntity = await _serviceRespository.FindByCondition(s => s.ID == req.ID).FirstOrDefaultAsync();

                oldEntity.Name = req.Name;
                oldEntity.Description = req.Description;
                oldEntity.Icon = req.Icon;
                oldEntity.CategoryId = req.CategoryId;

                oldEntity.GenerateModifyHistory(1);
                await _serviceRespository.UpdateAsync(oldEntity);
                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.ServiceAll);

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async ValueTask DeleteServiceById(long id)
        {
            try
            {
                var oldEntity = await _serviceRespository.FindByCondition(s => s.ID == id).FirstOrDefaultAsync();

                oldEntity.GenerateDeleteHistory(1);
                await _serviceRespository.DeleteAsync(oldEntity);
                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.ServiceAll);

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public async ValueTask<List<Service>> GetAllService()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.ServiceAll, out List<Service> cachedServices))
                {
                    return cachedServices; // CACHE HIT
                }

                var services = await _serviceRespository
                    .FindAll()
                    .Include(x => x.Category)
                    .ToListAsync();

                _cache.Set(
                    CacheKeys.ServiceAll,
                    services,
                    new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(_cacheSettings.AbsoluteExpirationMinutes),
                        SlidingExpiration = TimeSpan.FromMinutes(_cacheSettings.SlidingExpirationMinutes)
                    });

                return services;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
