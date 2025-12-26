using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Base;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Services.Interface;

namespace Services.Impl
{
    public class AttachmentService(
        IRepositary<Attachment> attachmentRepository,
        IConfiguration configuration
    ) : IAttachmentService
    {
        private readonly IRepositary<Attachment> _attachmentRepository = attachmentRepository;
        private readonly string _imagePath =
            configuration["ImageSettings:ImageUploadPath"]
            ?? throw new Exception("ImageUploadPath missing");

        // ============================
        // UPLOAD
        // ============================
        public async Task<Attachment> UploadAsync(
            AttachmentRequestDto dto)
        {
            try
            {
                var file = dto.File;
                if (file == null || file.Length == 0)
                    return null;

                if (!Directory.Exists(_imagePath))
                    Directory.CreateDirectory(_imagePath);

                var ext = Path.GetExtension(file.FileName).ToLower();
                var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".pdf" };

                if (!allowed.Contains(ext))
                    throw new InvalidDataException("Invalid file format");

                var storedName = $"{Guid.NewGuid()}{ext}";
                var fullPath = Path.Combine(_imagePath, storedName);

                await using (var fs = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(fs);
                }

                // 🔑 DTO → ENTITY
                var entity = dto.ToMap<AttachmentRequestDto, Attachment>();
                entity.FileName = file.FileName;
                entity.FilePath = fullPath;

                entity.GenerateCreateHistory(1);

                await _attachmentRepository.CreateAsync(entity);

                return entity;
            }
            catch
            {
                throw;
            }
        }

        // ============================
        // GET BY ID
        // ============================
        public async Task<AttachmentResponseDto?> GetByIdAsync(long id)
        {
            try
            {
                var entity = await _attachmentRepository
                    .FindByCondition(x => x.ID == id)
                    .AsNoTracking()
                    .FirstOrDefaultAsync();

                if (entity == null)
                    return null;

                return entity.ToMap<Attachment, AttachmentResponseDto>();
            }
            catch
            {
                throw;
            }
        }
    }
}
