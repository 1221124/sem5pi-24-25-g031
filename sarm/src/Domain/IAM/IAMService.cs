using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using Domain.Shared;
using Domain.Users;
using Domain.UsersSession;
using Infrastructure;

namespace Domain.IAM
{
    public class IAMService
    {
        private readonly HttpClient _httpClient;

        public IAMService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<TokenResponse> ExchangeCodeForTokenAsync(string code)
        {
            var requestBody = new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", AppSettings.IAMClientId },
                { "client_secret", AppSettings.IAMClientSecret },
                { "redirect_uri", AppSettings.IAMRedirectUri },
                { "grant_type", "authorization_code" }
            };

            var requestContent = new FormUrlEncodedContent(requestBody);

            var response = await _httpClient.PostAsync("https://dev-sagir8s22k2ehmk0.us.auth0.com/oauth/token", requestContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to exchange authorization code for token. Error: {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(responseContent);

            if (tokenResponse == null || tokenResponse.IdToken == null)
            {
                throw new Exception("Token not found in response.");
            }

            return tokenResponse;
        }

        public (string Email, List<string> Roles) GetClaimsFromToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new Exception("Token cannot be null or empty.");
            }

            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(token))
            {
                throw new Exception("Invalid token.");
            }

            var jwtToken = handler.ReadJwtToken(token);

            var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "https://api.sarmg031.com/email")?.Value;
            if (string.IsNullOrEmpty(emailClaim))
            {
                throw new Exception("Email claim not found in token.");
            }

            var rolesClaim = jwtToken.Claims
                .Where(claim => claim.Type == "https://api.sarmg031.com/roles")
                .Select(claim => claim.Value)
                .ToList();

            return (emailClaim, rolesClaim);
        }
    }

    public class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        [JsonPropertyName("id_token")]
        public string IdToken { get; set; }
    }
}