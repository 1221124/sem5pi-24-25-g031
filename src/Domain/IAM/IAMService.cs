using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure
{
    public class IAMService
    {
        public IAMService()
        {
        }

        // public async Task<TokenResponse> ExchangeCodeForTokenAsync(string code, string redirectUri)
        // {
        //     var requestBody = new Dictionary<string, string>
        //     {
        //         { "code", code },
        //         { "client_id", _clientId },
        //         { "client_secret", _clientSecret },
        //         { "redirect_uri", redirectUri },
        //         { "grant_type", "authorization_code" }
        //     };

        //     var response = await _httpClient.PostAsync(_tokenEndpoint, new FormUrlEncodedContent(requestBody));
        //     response.EnsureSuccessStatusCode();

        //     var json = await response.Content.ReadAsStringAsync();
        //     return JsonSerializer.Deserialize<TokenResponse>(json);
        // }

        // public async Task<string> GetUserInfoFromTokenAsync(string token)
        // {
        //     var request = new HttpRequestMessage(HttpMethod.Get, _userinfoEndpoint);
        //     request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        //     var response = await _httpClient.SendAsync(request);
        //     response.EnsureSuccessStatusCode();

        //     var json = await response.Content.ReadAsStringAsync();
        //     var userInfo = JsonSerializer.Deserialize<UserInfoResponse>(json);

        //     return userInfo.Email;
        // }


        public async Task<string> GetUserInfoFromTokenAsync(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.GoogleClientSecret)),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            try
            {
                var claimsPrincipal = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                var emailClaim = claimsPrincipal.FindFirst(ClaimTypes.Email);

                return emailClaim?.Value;
            }
            catch (Exception ex)
            {
                throw new Exception("Token validation failed.", ex);
            }
        }

        public class TokenResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public string IdToken { get; set; }
            public string ExpiresIn { get; set; }
        }

        public class UserInfoResponse
        {
            public string Email { get; set; }
        }
    }
}
