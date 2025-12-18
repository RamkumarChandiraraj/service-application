
namespace Common.Base
{
    public interface IBaseDto
    {
        public long ID { get; set; }
        public DateTime CreatedDate { get; set; }
        public long CreatedBy { get; set; }
        DateTime? UpdatedDate { get; set; }
        long UpdatedBy { get; set; }
        DateTime? DeletedDate { get; set; }
        long DeletedBy { get; set; }
        bool IsActive { get; set; }
    }
}
