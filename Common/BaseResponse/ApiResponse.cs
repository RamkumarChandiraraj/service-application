using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Common.BaseResponse
{
    public interface IApiResponse { }
    public class ApiResponse : IApiResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public bool IsSuccess { get; set; }


        public ApiResponse(object data, string message = null)
        {
            Data = data;
            //Meta = meta;
            Message = message;
        }

        public ApiResponse(HttpStatusCode statusCode, object data = null, string message = null, bool isSuccess = true)
        {
            StatusCode = statusCode;
            Data = data;
            Message = message;
            IsSuccess = isSuccess;
        }
    }
}
