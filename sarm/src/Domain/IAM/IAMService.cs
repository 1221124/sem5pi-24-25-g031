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
        private readonly Dictionary<string, SecurityKey> _publicKeys = [];

        public IAMService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<IEnumerable<SecurityKey>> LoadPublicKeysAsync()
        {
            try
            {
                var jwksUrl = $"{AppSettings.IAMDomain}.well-known/jwks.json";
                var response = await _httpClient.GetAsync(jwksUrl);
                response.EnsureSuccessStatusCode();

                var jwksJson = await response.Content.ReadAsStringAsync();
                var jwks = JsonConvert.DeserializeObject<JwksResponse>(jwksJson);
                if (jwks?.Keys == null || jwks.Keys.Count == 0)
                {
                    throw new Exception("No keys found in JWKS.");
                }

                return jwks.Keys.Select(key => new JsonWebKey
                {
                    Kty = key.Kty,
                    Alg = key.Alg,
                    Use = key.Use,
                    N = key.N,
                    E = key.E
                });
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

        public IEnumerable<SecurityKey> GetPublicKeys()
        {
            return _publicKeys.Values;
        }

        public SecurityKey GetPublicKey(string kid)
        {
            if (_publicKeys.TryGetValue(kid, out var publicKey))
            {
                return publicKey;
            }
            throw new Exception($"No public key found for kid: {kid}");
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

        public Email GetEmailFromIdToken(string idToken)
        {
            if (string.IsNullOrWhiteSpace(idToken))
            {
                throw new Exception("IdToken cannot be null or empty.");
            }

            var handler = new JwtSecurityTokenHandler();
            if (!handler.CanReadToken(idToken))
            {
                throw new Exception("Invalid token.");
            }

            var jwtToken = handler.ReadJwtToken(idToken);
            if (jwtToken.Payload == null || !jwtToken.Payload.Any())
            {
                throw new SecurityTokenException("Invalid token payload.");
            }

            var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "email")?.Value;
            if (string.IsNullOrEmpty(emailClaim))
            {
                throw new Exception("Email claim not found in token.");
            }

            return new Email(emailClaim);
        }
    }

    public class TokenResponse
    {
        // [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        // [JsonPropertyName("id_token")]
        public string IdToken { get; set; }

        public TokenResponse() {}

        public TokenResponse(string IdToken, string AccessToken) {
            this.IdToken = IdToken;
            this.AccessToken = AccessToken;
        }
    }

    public class JwksResponse
    {
        public List<Jwk> Keys { get; set; }
    }

    public class Jwk
    {
        public string Kid { get; set; }
        public string Kty { get; set; }
        public string Alg { get; set; }
        public string Use { get; set; }
        public string N { get; set; }
        public string E { get; set; }
    }
}