using Data.BaseEntity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities
{
    [Index(nameof(LocationCode), IsUnique = true)]
    public class Location : BaseEntityModel
    {
        [Key]
        public override long ID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }   // Electrician, Two Wheeler

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(20)]
        public string? LocationCode { get; set; }  // Unique

        [Column(TypeName = "decimal(9,6)")]
        public decimal Latitude { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal Longitude { get; set; }

        [Range(100000, 999999)]
        public int Pincode { get; set; }

        public long? ReferenceId { get; set; }
    }
}
