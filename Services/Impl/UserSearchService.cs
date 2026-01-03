using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Services.Interface;

namespace Services.Impl
{
    public class UserSearchService(
        IRepositary<Registration> registrationRepo,
        IRepositary<Service> serviceRepo
    ) : IUserSearchService
    {
        private readonly IRepositary<Registration> _registrationRepo = registrationRepo;
        private readonly IRepositary<Service> _serviceRepo = serviceRepo;
        public async ValueTask<List<UserSearchResponseDto>> SearchUsersAsync(UserSearchRequestDto request)
        {
            // Step 1: Filter Services
            var serviceQuery = _serviceRepo.FindAll();

            if (request.CategoryIds != null && request.CategoryIds.Any())
            {
                serviceQuery = serviceQuery
                    .Where(s => request.CategoryIds.Contains(s.CategoryId));
            }

            if (request.ServiceIds != null && request.ServiceIds.Any())
            {
                serviceQuery = serviceQuery
                    .Where(s => request.ServiceIds.Contains(s.ID));
            }

            var services = await serviceQuery
                .Include(s => s.Category)
                .ToListAsync();

            if (!services.Any())
                return new List<UserSearchResponseDto>();

            var serviceIds = services.Select(s => s.ID).ToList();

            // Step 2: Get Registrations
            var registrations = await _registrationRepo.FindAll()
                .Where(r => serviceIds.Contains(r.ServiceId))
                .ToListAsync();

            // Step 3: Sort by nearest (distance NOT returned)
            var result = registrations
                .Select(r => new
                {
                    Registration = r,
                    Distance = CalculateDistance(
                        (double)request.Latitude,
                        (double)request.Longitude,
                        r.Latitude,
                        r.Longitude
                    )
                })
                .Where(x => x.Distance <= 30)     // ✅ FILTER WITHIN 10 KM
                .OrderBy(x => x.Distance)         // ✅ SORT NEAREST FIRST
                .Select(x => new UserSearchResponseDto
                {
                    ID = x.Registration.ID,
                    CompanyName = x.Registration.CompanyName,
                    Description = x.Registration.Description,
                    LocationId = x.Registration.LocationId,
                    ServiceId = x.Registration.ServiceId
                })
                .ToList();

            return result;
        }

        // -------------------------------
        // Haversine Distance Calculation
        // -------------------------------
        private static double CalculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2)
        {
            const double R = 6371; // KM

            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) *
                Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) *
                Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private static double ToRadians(double angle)
        {
            return angle * Math.PI / 180;
        }

    }
}
