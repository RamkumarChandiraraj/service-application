
namespace Common.Settings
{
    public interface ICacheSettings
    {
        int AbsoluteExpirationMinutes { get; set; }
        int SlidingExpirationMinutes { get; set; }
    }
}
