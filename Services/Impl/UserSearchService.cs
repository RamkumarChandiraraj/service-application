using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Services.Interface;

namespace Services.Impl
{
    public class UserSearchService(
        IRepositary<Location> locationRepo,
        IRepositary<Registration> registrationRepo,
        IRepositary<Service> serviceRepo
    ) : IUserSearchService
    {
        public async ValueTask<List<RegistrationResponseDto>> SearchUsersAsync(
            UserSearchRequestDto dto)
        {
            // 1️⃣ Get all locations from DB
            var locations = await locationRepo.FindAll().ToListAsync();

            // 2️⃣ Calculate distance & filter nearby locations (within 10 km)
            var nearbyLocations = locations
                .Select(l => new
                {
                    Location = l,
                    Distance = CalculateDistance(
                        dto.Latitude,
                        dto.Longitude,
                        l.Latitude,
                        l.Longitude)
                })
                .Where(x => x.Distance <= 10) // Radius in KM
                .ToList();

            // If no nearby locations found → return empty list
            if (!nearbyLocations.Any())
                return new List<RegistrationResponseDto>();

            // 3️⃣ Get nearby location names
            var locationNames = nearbyLocations
                .Select(x => x.Location.Name.ToLower())
                .ToList();

            // 4️⃣ Get registrations matching nearby locations
            var registrations = await registrationRepo.FindAll()
                .Where(r => locationNames.Contains(r.Location.ToLower()))
                .ToListAsync();

            if (!registrations.Any())
                return new List<RegistrationResponseDto>();

            // 5️⃣ Get valid service names based on selected CategoryIds & ServiceIds
            var validServiceNames = await serviceRepo.FindAll()
                .Where(s => dto.ServiceIds.Contains(s.ID) &&
                            dto.CategoryIds.Contains(s.CategoryId))
                .Select(s => s.Name.ToLower())
                .ToListAsync();

            // 6️⃣ Filter registrations by services
            registrations = registrations
                .Where(r => validServiceNames.Any(s =>
                    r.Services.ToLower().Contains(s)))
                .ToList();

            // 7️⃣ Map registrations → response DTO
            var result = registrations.Select(r => new RegistrationResponseDto
            {
                ID = r.ID,
                CompanyName = r.CompanyName,
                Email = r.Email,
                PhoneNumber = r.PhoneNumber,
                Location = r.Location,
                Services = r.Services
            }).ToList();

            return result;
        }

        // 🔹 Haversine formula to calculate distance between two geo points
        private static double CalculateDistance(
            decimal lat1, decimal lon1,
            decimal lat2, decimal lon2)
        {
            const double R = 6371; // Earth radius in KM

            var dLat = DegreesToRadians((double)(lat2 - lat1));
            var dLon = DegreesToRadians((double)(lon2 - lon1));

            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreesToRadians((double)lat1)) *
                Math.Cos(DegreesToRadians((double)lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private static double DegreesToRadians(double degrees)
            => degrees * (Math.PI / 180);
    }
}
