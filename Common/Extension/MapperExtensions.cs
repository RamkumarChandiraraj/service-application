using Mapster;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Extension
{
    public static class MapperExtensions
    {
        public static TDestination ToMap<TSource, TDestination>(this TSource source) where TSource : new()
        {
            return TypeAdapter<TSource, TDestination>.Map(source);
        }
    }
}
