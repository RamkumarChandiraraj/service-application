using Data.BaseEntity;
using System.ComponentModel.DataAnnotations;

namespace Data.Entities
{
    public class Service : BaseEntityModel
    {
        [Key]
        public override long ID { get; set; }

        public string Name { get; set; }   // Electrician, Two Wheeler

        public string? Description { get; set; }

    }
}
