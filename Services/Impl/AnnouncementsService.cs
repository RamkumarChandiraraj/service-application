using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Services.Interface;
using System;

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
            var entity = new Announcements
            {
                Title = dto.Title,
                Description = dto.Description
            };

            _context.Announcements.Add(entity);
            await _context.SaveChangesAsync();

            return new AnnouncementsResponseDto
            {
                ID = entity.ID,
                Title = entity.Title,
                Description = entity.Description
            };
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var entity = await _context.Announcements.FindAsync(id);
            if (entity == null)
                return false;

            _context.Announcements.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<AnnouncementsResponseDto>> GetAllAsync()
        {
            return await _context.Announcements
                .Select(a => new AnnouncementsResponseDto
                {
                    ID = a.ID,
                    Title = a.Title,
                    Description = a.Description
                })
                .ToListAsync();
        }

        public async Task<AnnouncementsResponseDto?> GetByIdAsync(long id)
        {
            return await _context.Announcements
                .Where(a => a.ID == id)
                .Select(a => new AnnouncementsResponseDto
                {
                    ID = a.ID,
                    Title = a.Title,
                    Description = a.Description
                })
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateAsync(long id, AnnouncementsRequestDto dto)
        {
            var entity = await _context.Announcements.FindAsync(id);
            if (entity == null)
                return false;

            entity.Title = dto.Title;
            entity.Description = dto.Description;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
