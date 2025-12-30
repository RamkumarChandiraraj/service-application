using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Services.Impl
{
    public class AttachmentService : IAttachmentService
    {
        private readonly IRepositary<Attachment> _attachmentRepository;
        private readonly string _uploadPath;

        public AttachmentService(IRepositary<Attachment> attachmentRepository, IConfiguration configuration)
        {
            _attachmentRepository = attachmentRepository;
            _uploadPath = configuration["ImageSettings:ImageUploadPath"]
                          ?? throw new Exception("ImageUploadPath missing");
        }

        // ================= UPLOAD =================
        public async Task<Attachment> UploadAsync(AttachmentRequestDto dto)
        {
            var file = dto.File;
            if (file == null || file.Length == 0)
                throw new Exception("File is required");

            if (!Directory.Exists(_uploadPath))
                Directory.CreateDirectory(_uploadPath);

            var ext = Path.GetExtension(file.FileName);
            var storedName = $"{Guid.NewGuid()}{ext}";
            var fullPath = Path.Combine(_uploadPath, storedName);

            await using (var fs = new FileStream(fullPath, FileMode.Create))
                await file.CopyToAsync(fs);

            var entity = dto.ToMap<AttachmentRequestDto, Attachment>();
            entity.FileName = file.FileName;
            entity.FilePath = fullPath;
            entity.GenerateCreateHistory(1);

            await _attachmentRepository.CreateAsync(entity);
            return entity;
        }

        // ================= GET ALL =================
        public async Task<List<AttachmentResponseDto>> GetAllAsync()
        {
            var list = await _attachmentRepository
                .FindAll()
                .AsNoTracking()
                .OrderBy(x => x.CreatedDate)
                .ToListAsync();

            return list.Select(x => x.ToMap<Attachment, AttachmentResponseDto>()).ToList();
        }

        // ================= GET BY ID =================
        public async Task<AttachmentResponseDto?> GetByIdAsync(long id)
        {
            var entity = await _attachmentRepository
                .FindByCondition(x => x.ID == id)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            return entity?.ToMap<Attachment, AttachmentResponseDto>();
        }

        // ================= DELETE =================
        public async Task<bool> DeleteAsync(long id)
        {
            var entity = await _attachmentRepository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null) return false;
            if (File.Exists(entity.FilePath))
                File.Delete(entity.FilePath);

            await _attachmentRepository.DeleteAsync(entity);
            return true;
        }

        // ================= UPDATE =================
        public async Task<bool> UpdateAsync(long id, AttachmentRequestDto dto)
        {
            var entity = await _attachmentRepository
                .FindByCondition(x => x.ID == id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return false;

            if (dto.File == null || dto.File.Length == 0)
                throw new Exception("File is required");

            // Delete old file
            if (File.Exists(entity.FilePath))
                File.Delete(entity.FilePath);

            var ext = Path.GetExtension(dto.File.FileName);
            var newName = $"{Guid.NewGuid()}{ext}";
            var newPath = Path.Combine(_uploadPath, newName);

            await using (var fs = new FileStream(newPath, FileMode.Create))
                await dto.File.CopyToAsync(fs);

            entity.FileName = dto.File.FileName;
            entity.FilePath = newPath;

            await _attachmentRepository.UpdateAsync(entity);
            return true;
        }
    }
}
