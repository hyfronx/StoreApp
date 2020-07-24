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

    public class CostumerController : ControllerBase
    {
        private readonly IStoreRepository _repo;
        private readonly IMapper _mapper;

        public CostumerController(IStoreRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var costumer = await _repo.GetAllCostumersAsync();
                var results = _mapper.Map<CostumerDto[]>(costumer);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
              return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(CostumerDto model)
        {
            try
            {
                var costumer = _mapper.Map<Costumer>(model);
                _repo.Add(costumer);

                if(await _repo.SaveChangesAsync())
                    return StatusCode(StatusCodes.Status201Created, _mapper.Map<CostumerDto>(costumer));
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, CostumerDto model)
        {
            try
            {
                var costumer = await _repo.GetCostumerAsyncById(id);
                if(costumer == null) return NotFound();

                _mapper.Map(model, costumer);

                _repo.Update(costumer);

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