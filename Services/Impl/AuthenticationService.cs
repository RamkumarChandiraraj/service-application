using Common.RequestDto;
using Common.ResponseDto;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Services.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services.Impl
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IConfiguration _configuration;
        private readonly ServiceApplicationDbContext _context; // your EF DbContext

        public AuthenticationService(IConfiguration configuration, ServiceApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
        {
            try
            {
                var input = request.UserNameOrEmail.Trim();

                var user = await _context.Set<User>()
                    .FirstOrDefaultAsync(x =>
                    (x.UserName == request.UserNameOrEmail || x.Email == request.UserNameOrEmail) &&
                    x.Password == request.Password
                    );

                // hash compare in real apps
                if (user == null)
                    return null;

                // 2️⃣ Generate JWT
                var token = GenerateJwtToken(user);

                return new LoginResponseDto
                {
                    Token = token,
                };
            }
            catch
            {
                throw;
            }
        }

        private string GenerateJwtToken(User user)
        {
            try
            {
                var key = Encoding.ASCII.GetBytes(_configuration["JWT:SecretKey"]);

                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Issuer = _configuration["JWT:Issuer"],
                    Audience = _configuration["JWT:Audience"],
                    IssuedAt = DateTime.UtcNow,
                    Expires = DateTime.UtcNow.AddMinutes(
                        Convert.ToDouble(_configuration["JWT:ExpiryMinutes"])
                    ),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(key),
                        SecurityAlgorithms.HmacSha256Signature
                    )
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch
            {
                throw;
            }
        }
    }
}
