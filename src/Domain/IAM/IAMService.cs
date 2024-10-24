using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Google.Apis.Auth;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

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


        // public async Task<string> GetUserInfoFromTokenAsync(string token)
        // {
        //     var handler = new JwtSecurityTokenHandler();
        //     var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

        //     var validationParameters = new TokenValidationParameters
        //     {
        //         ValidateIssuerSigningKey = true,
        //         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.GoogleClientSecret)),
        //         ValidateIssuer = false,
        //         ValidateAudience = false
        //     };

        //     try
        //     {
        //         var claimsPrincipal = handler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
        //         var emailClaim = claimsPrincipal.FindFirst(ClaimTypes.Email);

        //         return emailClaim?.Value;
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception("Token validation failed.", ex);
        //     }
        // }

        public async Task<string> GetUserInfoFromTokenAsync(string idToken)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
            return payload.Email;
        }

        public async Task<string> ExchangeCodeForTokenAsync(string code)
        {
            var client = new HttpClient();
            var parameters = new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", AppSettings.GoogleClientId },
                { "client_secret", AppSettings.GoogleClientSecret },
                { "redirect_uri", "http://localhost:5500/api/Users/callback" },
                { "grant_type", "authorization_code" }
            };

            var response = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(parameters));
            var content = await response.Content.ReadAsStringAsync();

            var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(content);
            return tokenResponse.AccessToken;
        }

        public class TokenResponse
        {
            [JsonProperty("access_token")]
            public string AccessToken { get; set; }

            [JsonProperty("expires_in")]
            public int ExpiresIn { get; set; }

            [JsonProperty("token_type")]
            public string TokenType { get; set; }

            [JsonProperty("refresh_token")]
            public string RefreshToken { get; set; }
        }

        public class UserInfoResponse
        {
            public string Email { get; set; }
        }
    }
}
