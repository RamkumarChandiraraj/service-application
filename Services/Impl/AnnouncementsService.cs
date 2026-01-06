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

        public async Task<AnnouncementsResponseDto> CreateAsync(AnnouncementsRequestDto dto)
        {
            var entity = dto.ToMap<AnnouncementsRequestDto, Announcements>();
            await _repository.CreateAsync(entity);

            return entity.ToMap<Announcements, AnnouncementsResponseDto>();
        }

        public async Task<AnnouncementsResponseDto?> GetByIdAsync(long id)
        {
            var entity = await _repository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            return entity?.ToMap<Announcements, AnnouncementsResponseDto>();
        }

        public async Task<List<AnnouncementsResponseDto>> GetAllAsync()
        {
            var entities = await _repository
                .FindAll()
                .OrderByDescending(x => x.ID)
                .ToListAsync();

            return entities
                .Select(x => x.ToMap<Announcements, AnnouncementsResponseDto>())
                .ToList();
        }

        public async Task<bool> UpdateAsync(long id, AnnouncementsRequestDto dto)
        {
            //var entity = await _repository
            //    .findbycondition(x => x.id == id)
            //    .firstordefaultasync();

            //if (entity == null)
            //    return false;

            //dto.adapt(entity);
            //await _repository.updateasync(entity);
            return true;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var entity = await _repository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return false;

            await _repository.DeleteAsync(entity);
            return true;
        }
    }
}
