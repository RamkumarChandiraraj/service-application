
namespace Data.BaseEntity
{
    public abstract class BaseEntityModel :IBaseEntityModel
    {
        public virtual long ID { get; set; }
        public virtual DateTime CreatedDate { get; set; } = DateTime.Now;
        public virtual long CreatedBy { get; set; }
        public virtual DateTime? UpdatedDate { get; set; }
        public virtual long? UpdatedBy { get; set; }
        public virtual DateTime? DeletedDate { get; set; }
        public virtual long? DeletedBy { get; set; }
        public virtual bool IsActive { get; set; }

        public virtual void GenerateCreateHistory(long userId)
        {
            CreatedDate = DateTime.Now;
            CreatedBy = userId;
        }
        public virtual void GenerateModifyHistory(long userId)
        {
            UpdatedDate = DateTime.Now;
            UpdatedBy = userId;
        }
        public virtual void GenerateDeleteHistory(long userId)
        {
            DeletedDate = DateTime.Now;
            DeletedBy = userId;
        }
    }
}
