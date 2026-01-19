
namespace Common.Settings
{
    public class CacheSettings : ICacheSettings
    {
        public int AbsoluteExpirationMinutes { get; set; }
        public int SlidingExpirationMinutes { get; set; }
    }
}
