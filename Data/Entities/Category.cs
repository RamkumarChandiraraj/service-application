using Data.BaseEntity;
using System.ComponentModel.DataAnnotations;

namespace Data.Entities
{
    public class Category : BaseEntityModel
    {
        [Key]
        public override long ID { get; set; }

        public string Name { get; set; }   

        public string? Description { get; set; }
        public string? Icon { get; set; }

        public string Link { get; set; } = null!;

        public List<Service> Services { get; set; }

    }
}
