using Common.Base;
using Common.BaseResponse;
using Common.Extension;
using Common.RequestDto;
using Common.ResponseDto;
using Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Services.Interface;

namespace service_application.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController(
        ICategoryService categoryService,
        IApiMessage<IApiResponse> apiResponse) : ControllerBase
    {
        private readonly ICategoryService _categoryService = categoryService;
        private readonly IApiMessage<IApiResponse> _apiResponse = apiResponse;

        [HttpPost]
        public async ValueTask<IActionResult> Create(CategoryRequestDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Name))
                    return _apiResponse.BadRequest("Name is required");

                await _categoryService.CreateCategoryAsync(dto);
                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async ValueTask<IActionResult> Get(long id)
        {
            try
            {
                var entity = await _categoryService.GetCategoryByIdAsync(id);
                var dto = entity.ToMap<Category, CategoryResponseDto>();
                return _apiResponse.Ok(dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAll()
        {
            var list = await _categoryService.GetCategoryAllAsync();
            var result = list.ToMap<List<Category>, List<CategoryResponseDto>>();
            return _apiResponse.Ok(result);
        }

        [HttpPut]
        public async ValueTask<IActionResult> Update(CategoryRequestDto dto)
        {
            await _categoryService.UpdateCategoryAsync(dto);
            return _apiResponse.Ok(true);
        }

        [HttpDelete("{id}")]
        public async ValueTask<IActionResult> Delete(long id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return _apiResponse.Ok(true);
        }
    }
}
