using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.Domain;
using Store.Repository;
using Store.WebApi.Dtos;

namespace Store.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IStoreRepository _repo;
        private readonly IMapper _mapper;

        public ProductController(IStoreRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var products = await _repo.GetAllProductsAsync();
                var results = _mapper.Map<ProductDto[]>(products);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
              return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(ProductDto model)
        {
            try
            {
                var product = _mapper.Map<Product>(model);
                _repo.Add(product);

                if(await _repo.SaveChangesAsync())
                   return StatusCode(StatusCodes.Status201Created, _mapper.Map<ProductDto>(product));
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ProductDto model)
        {
            try
            {
                var product = await _repo.GetProductAsyncById(id);
                if(product == null) return NotFound();

                _mapper.Map(model, product);

                _repo.Update(product);

                if(await _repo.SaveChangesAsync())
                    return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }
    }
}