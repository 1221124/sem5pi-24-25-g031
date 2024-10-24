using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Domain.Users;
using System.IdentityModel.Tokens.Jwt;
using Infrastructure;
using Domain.Shared;

namespace Domain.IAM
{
    public class IAMService
    {
        private readonly string _googleURL;
        private readonly string _googleClientId;
        private readonly string _googleClientSecret;

        public IAMService()
        {
            _googleURL = AppSettings.GoogleURL;
            _googleClientId = AppSettings.GoogleClientId;
            _googleClientSecret = AppSettings.GoogleClientSecret;
        }

        public ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _googleURL,
                ValidAudience = _googleClientId,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_googleClientSecret))
            };

            try
            {
                return tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            }
            catch
            {
                return null;
            }
        }

        public async Task<Email> GetUserInfoFromTokenAsync(string token)
        {
            var principal = GetPrincipalFromToken(token);

            if (principal == null)
            {
                return null;
            }

            var email = principal.FindFirst(ClaimTypes.Email)?.Value;

            return new Email(email);
        }
    }
}
