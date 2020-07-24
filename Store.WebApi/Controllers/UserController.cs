using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Store.Domain.Identity;
using Store.Repository;
using Store.WebApi.Dtos;

namespace Store.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IStoreRepository _repo;

        public UserController(IConfiguration config,
                                UserManager<User> userManager,
                                SignInManager<User> signInManager,
                                IMapper mapper,
                                IStoreRepository repo)
        {
            _config = config;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var products = await _repo.GetAllUsersAsync();
                var results = _mapper.Map<UserDto[]>(products);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
              return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                var user = _mapper.Map<User>(userDto);
                var result = await _userManager.CreateAsync(user, userDto.Password);
                var userToReturn = _mapper.Map<UserDto>(user);

                if(result.Succeeded)
                    return StatusCode(StatusCodes.Status201Created, userToReturn);

                return BadRequest(result.Errors);
            }
            catch (System.Exception ex)
            {
              return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLogin)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(userLogin.UserName);

                if(user == null) return StatusCode(StatusCodes.Status404NotFound, "Usuário não localizado");

                var result = await _signInManager.CheckPasswordSignInAsync(user, userLogin.Password, false);

                if(result.Succeeded){
                    var appUser = await _userManager.Users
                            .FirstOrDefaultAsync(u => u.NormalizedUserName == userLogin.UserName.ToUpper());

                    var userToReturn = _mapper.Map<UserLoginDto>(appUser); 

                    return Ok(new {
                            token = GenerateJWToken(appUser).Result,
                            user = userToReturn
                        });
                }

                return Unauthorized();
            }
            catch (System.Exception ex)
            {
               return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, UserDto model)
        {
            try
            {
                var user = await _userManager.Users.FirstAsync(x => x.Id == id);
                if(user == null) return NotFound();
                if(HttpContext.User.Identity.Name != user.UserName) return StatusCode(StatusCodes.Status401Unauthorized, "Acesso negado. Não é possível alterar outros usuários");

                user.FullName = model.FullName;
                if(!string.IsNullOrEmpty(user.CPF)) user.CPF = model.CPF;
                
                if(!string.IsNullOrEmpty(model.Password))
                {
                    var newPassword = _userManager.PasswordHasher.HashPassword(user,model.Password);
                    user.PasswordHash = newPassword;
                }
                
                var res = await _userManager.UpdateAsync(user);
                if(res.Succeeded)
                    return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

            return BadRequest();
        }

        private async Task<string> GenerateJWToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach(var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key =  new SymmetricSecurityKey(Encoding.ASCII
                       .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}