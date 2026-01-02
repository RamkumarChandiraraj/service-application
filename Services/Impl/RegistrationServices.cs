
using Common.Extension;
using Common.RequestDto;
using Data.Base;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Impl
{
    public class RegistrationService : IRegistrationService
    {
        private readonly IRepositary<Registration> _registrationRepository;

        public RegistrationService(IRepositary<Registration> registrationRepository)
        {
            _registrationRepository = registrationRepository;
        }

        public async ValueTask<IActionResult> Create(RegistrationRequestDto dto)
        {
            var entity = dto.ToMap<RegistrationRequestDto, Registration>();
            entity.GenerateCreateHistory(1); // Assuming 1 is the current user ID
            await _registrationRepository.CreateAsync(entity);
            return new OkObjectResult(entity);
        }

        public async ValueTask<IActionResult> Get(long id)
        {
            var entity = await _registrationRepository
                .FindByCondition(r => r.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return new NotFoundObjectResult($"Registration with ID {id} not found.");

            return new OkObjectResult(entity);
        }

        public async ValueTask<IActionResult> GetAll()
        {
            var list = await _registrationRepository.FindAll().ToListAsync();
            return new OkObjectResult(list);
        }

        public async ValueTask<IActionResult> Update(int id, RegistrationRequestDto dto)
        {
            var entity = await _registrationRepository
                .FindByCondition(r => r.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return new NotFoundObjectResult($"Registration with ID {id} not found.");

            // Update fields
            entity.CompanyName = dto.CompanyName;
            entity.Email = dto.Email;
            entity.PhoneNumber = dto.PhoneNumber;
            entity.LocationId = dto.LocationId;
            entity.ServiceId = dto.ServiceId;
            entity.Description = dto.Description;
            entity.Latitude = dto.Latitude;
            entity.Longitude = dto.Longitude;

            await _registrationRepository.UpdateAsync(entity);

            return new OkObjectResult("Registration updated successfully");
        }

        public async ValueTask<IActionResult> Delete(long id)
        {
            var entity = await _registrationRepository
                .FindByCondition(r => r.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return new NotFoundObjectResult($"Registration with ID {id} not found.");

            entity.GenerateDeleteHistory(1);
            await _registrationRepository.DeleteAsync(entity);

            return new OkObjectResult(true);
        }


        
    }
}
