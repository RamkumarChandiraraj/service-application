using Data.BaseEntity;
using System.ComponentModel.DataAnnotations;

namespace Data.Entities
{
    public class Attachment:BaseEntityModel
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public string FileName { get; set; }

        [Required]
        public string FilePath { get; set; }
    }
}
