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
    public class LocationService(IRepositary<Location> locationRepository, IMemoryCache memoryCache,
        ICacheSettings cacheSettings) : ILocationService
    {
        private readonly IRepositary<Location> _locationRepository = locationRepository;
        private readonly IMemoryCache _cache = memoryCache;
        private readonly ICacheSettings _cacheSettings = cacheSettings;

        public async ValueTask<Location> CreateLocationAsync(LocationRequestDto req)
        {
            try
            {
                var entity = req.ToMap<LocationRequestDto, Location>();

                entity.GenerateCreateHistory(1);
                await _locationRepository.CreateAsync(entity);
                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.LocationAll);

                return entity;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async ValueTask<Location> GetLocationById(long id)
        {
            try
            {
                List<Location> locations;
                // 1️⃣ Try to get all locations from cache
                if (!_cache.TryGetValue(CacheKeys.LocationAll, out locations))
                {
                    // 2️⃣ Cache miss → fetch from DB
                    locations = await _locationRepository.FindAll().ToListAsync();

                    // 3️⃣ Store in cache
                    _cache.Set(
                        CacheKeys.LocationAll,
                        locations,
                        new MemoryCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow =
                                TimeSpan.FromMinutes(_cacheSettings.AbsoluteExpirationMinutes),
                            SlidingExpiration =
                                TimeSpan.FromMinutes(_cacheSettings.SlidingExpirationMinutes)
                        });
                }

                // 4️⃣ Find location by ID
                var location = locations.FirstOrDefault(l => l.ID == id);
                if (location == null)
                    throw new InvalidDataException($"Id '{id}' not exists.");

                return location;
            }
            catch
            {
                throw;
            }
        }


        public async ValueTask UpdateLocationByIdAsync(LocationRequestDto req)
        {
            try
            {
                var oldEntity = await GetLocationById(req.ID);

                oldEntity.Name = req.Name;
                oldEntity.Description = req.Description;
                oldEntity.LocationCode = req.LocationCode;
                oldEntity.Latitude = req.Latitude;
                oldEntity.Longitude = req.Longitude;
                oldEntity.Pincode = req.Pincode;
                oldEntity.ReferenceId = req.ReferenceId;

                oldEntity.GenerateModifyHistory(1);
                await _locationRepository.UpdateAsync(oldEntity);
                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.LocationAll);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async ValueTask DeleteLocationById(long id)
        {
            try
            {
                var oldEntity = await GetLocationById(id);

                oldEntity.GenerateDeleteHistory(1);
                await _locationRepository.DeleteAsync(oldEntity);
                // 🔥 Invalidate cache
                _cache.Remove(CacheKeys.LocationAll);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async ValueTask<List<Location>> GetAllLocation()
        {
            try
            {
                if (_cache.TryGetValue(CacheKeys.LocationAll, out List<Location> cachedLocations))
                {
                    return cachedLocations; // CACHE HIT
                }

                var locations = await _locationRepository
                    .FindAll()
                    .ToListAsync();

                _cache.Set(
                    CacheKeys.LocationAll,
                    locations,
                    new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow =
                            TimeSpan.FromMinutes(_cacheSettings.AbsoluteExpirationMinutes),
                        SlidingExpiration =
                            TimeSpan.FromMinutes(_cacheSettings.SlidingExpirationMinutes)
                    });

                return locations;
            }
            catch
            {
                throw;
            }
        }
    }
}
