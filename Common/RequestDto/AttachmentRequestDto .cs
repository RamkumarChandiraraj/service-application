using Common.Base;
using Microsoft.AspNetCore.Http;

namespace Common.RequestDto
{
    public class AttachmentRequestDto : BaseDto
    {
        public IFormFile File { get; set; } = null!;

        // Optional – useful for mapping attachments to entities
        public long? ReferenceId { get; set; }

        // Optional – module or table name (Category, User, Product, etc.)
        public string? ModuleName { get; set; }
    }
}
