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
                throw new Exception("Failed to exchange authorization code for token.");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseContent);

            if (tokenResponse == null || tokenResponse.IdToken == null)
            {
                throw new Exception("Token not found in response.");
            }

            return tokenResponse;
        }

        public string GetEmailFromIdToken(string idToken)
        {
            if (string.IsNullOrWhiteSpace(idToken))
            {
                throw new Exception("ID token cannot be null or empty.");
            }

            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(idToken))
            {
                throw new Exception("Invalid ID token.");
            }

            var jwtToken = handler.ReadJwtToken(idToken);
            var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email");
            if (emailClaim == null)
            {
                throw new Exception("Email claim not found in ID token.");
            }

            return emailClaim.Value;
        }
    }

    public class TokenResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("id_token")]
        public string IdToken { get; set; }
    }
}