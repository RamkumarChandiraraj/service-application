using Common.Extension;
using Common.RequestDto;
using Data.Base;
using Data.Entities;
using Services.Interface;

namespace Services.Impl
{
    public class LocationService(IRepositary<Location> locationRepository) : ILocationService
    {
        private readonly IRepositary<Location> _locationRepository = locationRepository;

        public async ValueTask<Location> CreateLocationAsync(LocationRequestDto req)
        {
            try
            {
                var entity = req.ToMap<LocationRequestDto, Location>();

                entity.GenerateCreateHistory(1);
                await _locationRepository.CreateAsync(entity);

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
                var location = await ValueTask.FromResult(
                    _locationRepository.FindByCondition(x => x.ID == id).FirstOrDefault()
                );

                if (location == null)
                {
                    throw new InvalidDataException($"Id '{id}' not exists.");
                }

                return location;
            }
            catch (Exception)
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
                var locations = await ValueTask.FromResult(
                    _locationRepository.FindAll().ToList()
                );

                return locations;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
