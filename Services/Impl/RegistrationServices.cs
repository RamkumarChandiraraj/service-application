using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Interface;

namespace Services.Impl
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IRepositary<Registration> _registrationRepository;

        public RegistrationService(IRepositary<Registration> registrationRepository)
        {
            _registrationRepository = registrationRepository;
        }

        /* ================= DUPLICATE CHECKS ================= */

        public async Task<bool> EmailExists(string email)
        {
            return await _registrationRepository
                .FindByCondition(r => r.Email.ToLower() == email.ToLower())
                .AnyAsync();
        }

        public async Task<bool> PhoneNumberExists(long phoneNumber)
        {
            return await _registrationRepository
                .FindByCondition(r => r.PhoneNumber == phoneNumber)
                .AnyAsync();
        }

        /* ================= CREATE ================= */

        public async ValueTask<IActionResult> Create(RegistrationRequestDto dto)
        {
            // 🔒 Duplicate Email
            if (await EmailExists(dto.Email))
                return new BadRequestObjectResult("Email already exists");

            // 🔒 Duplicate Phone
            if (await PhoneNumberExists(dto.PhoneNumber))
                return new BadRequestObjectResult("Phone number already exists");

            var entity = dto.ToMap<RegistrationRequestDto, Registration>();

            entity.Email = dto.Email.ToLower(); // ✅ lowercase
            entity.ProfileImageId = dto.ProfileImageId; // ✅ attachment
            entity.GenerateCreateHistory(1);

            await _registrationRepository.CreateAsync(entity);

            return new OkObjectResult(entity);
        }

        /* ================= GET BY ID ================= */

        public async ValueTask<IActionResult> Get(long id)
        {
            var entity = await _registrationRepository
                .FindByCondition(r => r.ID == id)
                .Include(r => r.ProfileImage) // include profile image
                .FirstOrDefaultAsync();

            if (entity == null)
                return new NotFoundObjectResult($"Registration with ID {id} not found");

            // Map to Response DTO
            var response = entity.Adapt<RegistrationResponseDto>();

            if (entity.ProfileImage != null)
            {
                response.ProfileImageId = entity.ProfileImage.ID;
                response.ProfileImageUrl = "/Uploads/" + entity.ProfileImage.FileName;
            }

            return new OkObjectResult(response);
        }


        /* ================= GET ALL ================= */

        public async ValueTask<IActionResult> GetAll()
        {
            var list = await _registrationRepository
                .FindAll()
                .Include(r => r.ProfileImage)
                .ToListAsync();

            // Map each entity to Response DTO with image URL
            var responseList = list.Select(entity =>
            {
                var dto = entity.Adapt<RegistrationResponseDto>();
                if (entity.ProfileImage != null)
                {
                    dto.ProfileImageId = entity.ProfileImage.ID;
                    dto.ProfileImageUrl = "/Uploads/" + entity.ProfileImage.FileName;
                }
                return dto;
            }).ToList();

            return new OkObjectResult(responseList);
        }


        /* ================= UPDATE ================= */

        public async ValueTask<IActionResult> Update(long id, RegistrationRequestDto dto)
        {
            var entity = await _registrationRepository
                .FindByCondition(r => r.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return new NotFoundObjectResult($"Registration with ID {id} not found");

            // 🔒 Duplicate Email (ignore current record)
            var emailExists = await _registrationRepository
                .FindByCondition(r =>
                    r.Email.ToLower() == dto.Email.ToLower() &&
                    r.ID != id)
                .AnyAsync();

            if (emailExists)
                return new BadRequestObjectResult("Email already exists");

            // 🔒 Duplicate Phone
            var phoneExists = await _registrationRepository
                .FindByCondition(r =>
                    r.PhoneNumber == dto.PhoneNumber &&
                    r.ID != id)
                .AnyAsync();

            if (phoneExists)
                return new BadRequestObjectResult("Phone number already exists");

            // ✅ Update fields
            entity.CompanyName = dto.CompanyName;
            entity.Email = dto.Email.ToLower();
            entity.PhoneNumber = dto.PhoneNumber;
            entity.LocationId = dto.LocationId;
            entity.ServiceId = dto.ServiceId;
            entity.Description = dto.Description;
            entity.Latitude = dto.Latitude;
            entity.Longitude = dto.Longitude;
            entity.ProfileImageId = dto.ProfileImageId;

            await _registrationRepository.UpdateAsync(entity);

            return new OkObjectResult("Registration updated successfully");
        }

        /* ================= DELETE ================= */

        public async ValueTask<IActionResult> Delete(long id)
        {
            var entity = await _registrationRepository
                .FindByCondition(r => r.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return new NotFoundObjectResult($"Registration with ID {id} not found");

            entity.GenerateDeleteHistory(1);
            await _registrationRepository.DeleteAsync(entity);

            return new OkObjectResult(true);
        }
    }
}
