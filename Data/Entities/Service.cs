using Data.BaseEntity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Entities
{
    public class Service : BaseEntityModel
    {
        [Key]
        public override long ID { get; set; }

        public string Name { get; set; }   // Electrician, Two Wheeler

        public string? Description { get; set; }

        public string? Icon { get; set; }

        public long CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public virtual Category Category { get; set; }
    }
}
