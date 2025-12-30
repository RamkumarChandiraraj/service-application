using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Mapster;

namespace Services.Mapper
{
    public class AttachmentMapper : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<AttachmentRequestDto, Attachment>();
            config.NewConfig<Attachment, AttachmentResponseDto>();
            config.NewConfig<List<AttachmentRequestDto>, List<Attachment>>();
            config.NewConfig<List<Attachment>, List<AttachmentResponseDto>>();
        }
    }
}
