using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Services.Interface;

namespace Services.Impl
{
    public class AnnouncementsService : IAnnouncementsService
    {
        private readonly IRepositary<Announcements> _repository;

        public AnnouncementsService(IRepositary<Announcements> repository)
        {
            _repository = repository;
        }

        // CREATE
        public async ValueTask<AnnouncementsResponseDto> CreateAsync(AnnouncementsRequestDto dto)
        {
            var entity = dto.ToMap<AnnouncementsRequestDto, Announcements>();
            entity.GenerateCreateHistory(1);

            await _repository.CreateAsync(entity);

            return entity.ToMap<Announcements, AnnouncementsResponseDto>();
        }

        // READ BY ID
        public async ValueTask<AnnouncementsResponseDto?> GetByIdAsync(long id)
        {
            var entity = await _repository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            return entity?.ToMap<Announcements, AnnouncementsResponseDto>();
        }

        // READ ALL
        public async ValueTask<List<AnnouncementsResponseDto>> GetAllAsync()
        {
            var entities = await _repository
                .FindAll()
                .OrderByDescending(x => x.ID)
                .ToListAsync();

            return entities
                .Select(x => x.ToMap<Announcements, AnnouncementsResponseDto>())
                .ToList();
        }

        // UPDATE
        public async ValueTask<bool> UpdateByIdAsync(long id, AnnouncementsRequestDto dto)
        {
            var oldEntity = await _repository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            if (oldEntity == null)
                return false;

            oldEntity.Title = dto.Title;
            oldEntity.Description = dto.Description;

            oldEntity.GenerateModifyHistory(1);

            await _repository.UpdateAsync(oldEntity);
            //await _repository.SaveChangesAsync(oldEntity); // ensures update persists

            return true;
        }

        // DELETE
        public async ValueTask<bool> DeleteByIdAsync(long id)
        {
            var entity = await _repository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return false;

            entity.GenerateDeleteHistory(1);

            await _repository.DeleteAsync(entity);
            await _repository.SaveChangesAsync(entity);

            return true;
        }
    }
}
