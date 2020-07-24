using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Store.Domain;
using Store.Repository;
using Store.WebApi.Dtos;

namespace Store.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class OrderController : ControllerBase
    {
        private readonly IStoreRepository _repo;
        private readonly IMapper _mapper;

        public OrderController(IStoreRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var orders = await _repo.GetAllOrdersAsync();
                var results = _mapper.Map<OrderDto[]>(orders);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
              return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var order = await _repo.GetOrderAsyncById(id);
                order.Costumer.Orders = null;
                order.OrderProducts.ForEach(x =>{
                    x.Order = null;
                });
                
                var result = _mapper.Map<OrderDto>(order);
                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(OrderDto model)
        {
            try
            {
                model.SellerUser = HttpContext.User.Identity.Name;
                model.Date = DateTime.Now.ToString();
                
                var order = _mapper.Map<Order>(model);

                _repo.Add(order);

                if(await _repo.SaveChangesAsync())
                    return StatusCode(StatusCodes.Status201Created, _mapper.Map<OrderDto>(order));
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, OrderDto model)
        {
            try
            {
                var order = await _repo.GetOrderAsyncById(id);
                if(order == null) return NotFound();

                _mapper.Map(model, order);

                _repo.Update(order);

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