using Common.RequestDto;
using Data.Entities;

namespace Services.Interface
{
    public interface IServiceService
    {
        ValueTask<Service> CreateServiceAsync(ServiceRequestDto req);
        ValueTask<Service> GetServiceById(long id);
        ValueTask UpdateServiceByIdAsync(ServiceRequestDto req);
        ValueTask DeleteServiceById(long id);
        ValueTask<List<Service>> GetAllService();
    }
}
