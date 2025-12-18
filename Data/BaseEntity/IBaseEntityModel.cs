using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.BaseEntity
{
    public interface IBaseEntityModel
    {
        long ID { get; set; }
        DateTime CreatedDate { get; set; }
        long CreatedBy { get; set; }
        DateTime? UpdatedDate { get; set; }
        long? UpdatedBy { get; set; }
        DateTime? DeletedDate { get; set; }
        long? DeletedBy { get; set; }
        bool IsActive { get; set; }
    }
}
