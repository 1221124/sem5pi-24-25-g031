using System.IdentityModel.Tokens.Jwt;
using Domain.Shared;
using Infrastructure;
using Newtonsoft.Json;

namespace Domain.IAM
{
    public class IAMService
    {
        private readonly HttpClient _httpClient;
        public IAMService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> ExchangeCodeForTokenAsync(string code)
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
                throw new Exception("Failed to exchange authorization code for token.");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseContent);

            if (tokenResponse.AccessToken == null)
            {
                throw new Exception("Access token not found in response.");
            }

            return tokenResponse.AccessToken;
        }

        public async Task<Email> GetEmailFromCodeAsync(string token)
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
            // var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email");
            var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "https://dev-sagir8s22k2ehmk0.us.auth0.com/api/v2/email");
            return emailClaim?.Value ?? throw new Exception("Email claim not found in token.");
        }

    }

    public class TokenResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        
    }

}
