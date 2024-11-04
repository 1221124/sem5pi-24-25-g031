using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;
using Domain.Shared;
using Domain.Users;
using Domain.UsersSession;
using Infrastructure;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace Domain.IAM
{
    public class IAMService
    {
        private readonly HttpClient _httpClient;
        private SecurityKey _publicKey;

        public IAMService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<SecurityKey> GetPublicKeyAsync()
        {
            if (_publicKey != null)
                return _publicKey;

            try
            {
                var response = await _httpClient.GetStringAsync($"{AppSettings.IAMDomain}.well-known/jwks.json");
                // Console.WriteLine($"JWKS Response: {response}");
                var jwks = JsonConvert.DeserializeObject<JwksResponse>(response);
                if (jwks?.Keys == null || !jwks.Keys.Any())
                {
                    throw new Exception("No keys found in JWKS.");
                }

                var rsa = RSA.Create();
                rsa.ImportParameters(new RSAParameters
                {
                    Modulus = Base64UrlEncoder.DecodeBytes(jwks.Keys[0].N),
                    Exponent = Base64UrlEncoder.DecodeBytes(jwks.Keys[0].E)
                });

                _publicKey = new RsaSecurityKey(rsa);
                return _publicKey;
            }
            catch (HttpRequestException ex)
            {
                throw new Exception("Error fetching JWKS: " + ex.Message);
            }
            catch (Newtonsoft.Json.JsonException ex)
            {
                throw new Exception("Error deserializing JWKS: " + ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred: " + ex.Message);
            }
        }

        public async Task<TokenResponse> ExchangeCodeForTokenAsync(string code)
        {
            var requestBody = new Dictionary<string, string>
            {
                { "code", code },
                { "client_id", AppSettings.IAMClientId },
                { "client_secret", AppSettings.IAMClientSecret },
                { "redirect_uri", AppSettings.IAMRedirectUri },
                { "grant_type", "authorization_code" },
                { "audience", AppSettings.IAMAudience },
                { "scope", "openid email profile" }
            };

            var requestContent = new FormUrlEncodedContent(requestBody);

            var response = await _httpClient.PostAsync($"{AppSettings.IAMDomain}oauth/token", requestContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to exchange authorization code for token. Error: {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = System.Text.Json.JsonSerializer.Deserialize<TokenResponse>(responseContent);

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
            if (jwtToken.Payload == null || !jwtToken.Payload.Any())
            {
                throw new SecurityTokenException("Invalid token payload.");
            }

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

    public class JwksResponse
    {
        public List<Jwk> Keys { get; set; }
    }

    public class Jwk
    {
        public string Kty { get; set; }
        public string Use { get; set; }
        public string N { get; set; }
        public string E { get; set; }
        public string Kid { get; set; }
        public string X5t { get; set; }
        public List<string> X5c { get; set; }
        public string Alg { get; set; }
    }
}