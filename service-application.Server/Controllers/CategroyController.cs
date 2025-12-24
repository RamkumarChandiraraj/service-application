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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IApiMessage<IApiResponse> _apiResponse;

        public CategoryController(
            ICategoryService categoryService,
            IApiMessage<IApiResponse> apiResponse)
        {
            _categoryService = categoryService;
            _apiResponse = apiResponse;
        }

        [HttpPost]
        public async ValueTask<IActionResult> CreateCategory([FromBody] CategoryRequestDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Name))
                    return _apiResponse.BadRequest("Name is required");

                if (string.IsNullOrWhiteSpace(dto.Description))
                    return _apiResponse.BadRequest("Description is required");

                var result = await _categoryService.CreateCategoryAsync(dto);
                return _apiResponse.Ok(result.ID);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("{id:long}")]
        public async ValueTask<IActionResult> GetById(long id)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                var entity = await _categoryService.GetCategoryByIdAsync(id);
                if (entity == null)
                    return _apiResponse.NotFound("Category not found");

                var dto = entity.ToMap<Category, CategoryResponseDto>();
                return _apiResponse.Ok(dto);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpPut("{id:long}")]
        public async ValueTask<IActionResult> Update(
       long id,
       [FromBody] CategoryRequestDto dto)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                if (dto == null)
                    return _apiResponse.BadRequest("Request body is required");

                dto.ID = id; // 🔑 sync route id with body

                var updated = await _categoryService.UpdateCategoryByIdAsync(dto);
                if (!updated)
                    return _apiResponse.NotFound("Category not found");

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpDelete("{id:long}")]
        public async ValueTask<IActionResult> Delete(long id)
        {
            try
            {
                if (id <= 0)
                    return _apiResponse.BadRequest("Invalid Id");

                var deleted = await _categoryService.DeleteCategoryByIdAsync(id);
                if (!deleted)
                    return _apiResponse.NotFound("Category not found");

                return _apiResponse.Ok(true);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }

        [HttpGet("list")]
        public async ValueTask<IActionResult> GetAll()
        {
            try
            {
                var data = await _categoryService.GetCategoryAllAsync();
                var result = data.ToMap<List<Category>, List<CategoryResponseDto>>();
                return _apiResponse.Ok(result);
            }
            catch (Exception ex)
            {
                return _apiResponse.InternalServerError(ex.Message);
            }
        }
    }
}
