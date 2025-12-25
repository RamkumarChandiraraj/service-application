using Data;
using Data.Context;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace service_application.Server.Controllers
{
    [ApiController]
    [Route("api/attachment")]
    public class AttachmentController : ControllerBase
    {
        private readonly ServiceApplicationDbContext _context;
        private readonly string _imagePath;

        public AttachmentController(ServiceApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _imagePath = configuration["ImageSettings:ImageUploadPath"];

            if (!Directory.Exists(_imagePath))
                Directory.CreateDirectory(_imagePath);
        }

        // ===============================
        // UPLOAD IMAGE
        // ===============================
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var allowedTypes = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedTypes.Contains(extension))
                return BadRequest("Invalid image format");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(_imagePath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var attachment = new Attachment
            {
                FileName = file.FileName,
                FilePath = filePath
            };

            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Image uploaded successfully",
                id = attachment.Id,
                fileName = attachment.FileName
            });
        }

        // ===============================
        // DOWNLOAD IMAGE BY ID
        // ===============================
        [HttpGet("download/id/{id}")]
        public async Task<IActionResult> DownloadById(long id)
        {
            var attachment = await _context.Attachments.FindAsync(id);
            if (attachment == null)
                return NotFound("Image not found");

            var imageBytes = await System.IO.File.ReadAllBytesAsync(attachment.FilePath);
            var contentType = GetContentType(attachment.FilePath);

            return File(imageBytes, contentType, attachment.FileName);
        }

        // ===============================
        // DOWNLOAD IMAGE BY FILENAME
        // ===============================
        [HttpGet("download/name/{fileName}")]
        public async Task<IActionResult> DownloadByFileName(string fileName)
        {
            var attachment = await _context.Attachments
                .FirstOrDefaultAsync(a => a.FileName == fileName);

            if (attachment == null)
                return NotFound("Image not found");

            var imageBytes = await System.IO.File.ReadAllBytesAsync(attachment.FilePath);
            var contentType = GetContentType(attachment.FilePath);

            return File(imageBytes, contentType, attachment.FileName);
        }

        private string GetContentType(string path)
        {
            var ext = Path.GetExtension(path).ToLower();
            return ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }
    }
}
