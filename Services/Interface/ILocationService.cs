using Common.RequestDto;
using Data.Entities;

namespace Services.Interface
{
    public interface ILocationService
    {
        ValueTask<Location> CreateLocationAsync(LocationRequestDto req);
        ValueTask<Location> GetLocationById(long id);
        ValueTask UpdateLocationByIdAsync(LocationRequestDto req);
        ValueTask DeleteLocationById(long id);
        ValueTask<List<Location>> GetAllLocation();
    }
}
