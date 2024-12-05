using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Domain.Shared;
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
            var tokenResponse = System.Text.Json.JsonSerializer.Deserialize<TokenResponse>(responseContent) ?? throw new Exception("Token not found in response.");
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

            var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == $"{AppSettings.IAMAudience}/email")?.Value;
            if (string.IsNullOrEmpty(emailClaim))
            {
                throw new Exception("Email claim not found in token.");
            }

            var rolesClaim = jwtToken.Claims
                .Where(claim => claim.Type == $"{AppSettings.IAMAudience}/roles")
                .Select(claim => claim.Value)
                .ToList();

            return (emailClaim, rolesClaim);
        }

        public async Task<string> GetIAMUserIdByEmailAsync(string email, string managementToken, string accessToken)
        {
            var url = $"{AppSettings.IAMDomain}api/v2/users-by-email?email={email}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Authorization", $"Bearer {managementToken}");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Failed to retrieve user. Status code: {response.StatusCode}");
            }

            var content = await response.Content.ReadAsStringAsync();
            var users = JsonConvert.DeserializeObject<List<Auth0User>>(content);

            if (users == null || users.Count == 0)
            {
                throw new Exception("User not found");
            }

            var user = users.FirstOrDefault(u => 
                u.Identities != null && 
                u.Identities.Any(i => i.Provider == GetLoginProviderFromAccessToken(accessToken))
            );

            if (user == null)
            {
                throw new Exception("No user found with the specified provider");
            }

            return user.UserId;
        }

        public string GetLoginProviderFromAccessToken(string accessToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accessToken) as JwtSecurityToken;

            if (jsonToken == null)
            {
                throw new Exception("Invalid access token");
            }

            var subClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;

            if (subClaim != null)
            {
                var provider = subClaim.Split('|')[0];
                return provider;
            }

            throw new Exception("Unable to determine login provider from sub claim");
        }

        public async Task<(bool done, string role)> AssignRoleToUserAsync(string email, string accessToken)
        {
            string role = "";
            string roleId = "";

            string managementToken = await GetManagementTokenAsync();
            string emailTrimmed = email.Trim().ToLower();
            string userId = await GetIAMUserIdByEmailAsync(email, managementToken, accessToken);

            var url = $"{AppSettings.IAMDomain}api/v2/users/{userId}/roles";

            Console.WriteLine("Email: " + emailTrimmed);
            Console.WriteLine("AdminEmail: " + AppSettings.AdminEmail.Trim().ToLower());
            Console.WriteLine("DoctorEmail: " + AppSettings.DoctorEmail.Trim().ToLower());
            Console.WriteLine("NurseEmail: " + AppSettings.NurseEmail.Trim().ToLower());
            Console.WriteLine("TechnicianEmail: " + AppSettings.TechnicianEmail.Trim().ToLower());
            Console.WriteLine("EmailDomain: " + AppSettings.EmailDomain.Trim().ToLower());
            Console.WriteLine("UserId: " + userId);
            Console.WriteLine("Url: " + url);

            if (emailTrimmed.Equals(AppSettings.AdminEmail.Trim().ToLower()))
            {
                roleId = AppSettings.RoleAdmin;
                role = "Admin";
            } else if (emailTrimmed.EndsWith(AppSettings.EmailDomain.Trim().ToLower()))
            {
                if (emailTrimmed.StartsWith("d") || emailTrimmed.Equals(AppSettings.DoctorEmail.Trim().ToLower())) {
                    roleId = AppSettings.RoleDoctor;
                    role = "Doctor";
                } else if (emailTrimmed.StartsWith("n") || emailTrimmed.Equals(AppSettings.NurseEmail.Trim().ToLower())) {
                    roleId = AppSettings.RoleNurse;
                    role = "Nurse";
                } else if (emailTrimmed.StartsWith("t") || emailTrimmed.Equals(AppSettings.TechnicianEmail.Trim().ToLower())) {
                    roleId = AppSettings.RoleTechnician;
                    role = "Technician";
                }
            } else {
                roleId = AppSettings.RolePatient;
                role = "Patient";
            }

            Console.WriteLine("Role: " + role);
            Console.WriteLine("RoleId: " + roleId);

            var requestBody = new
            {
                roles = new[] { roleId }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json")
            };

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", managementToken);

            var response = await _httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Role {role} assigned to user {email}");
                return (true, role);
            }
            else
            {
                Console.WriteLine($"Failed to assign role. Body: {response.Content.ReadAsStringAsync()}");
                return (false, role);
            }
        }

        private async Task<string> GetManagementTokenAsync()
        {
            var url = $"{AppSettings.IAMDomain}oauth/token";

            var requestBody = new
            {
                grant_type = "client_credentials",
                client_id = AppSettings.IAMClientId,
                client_secret = AppSettings.IAMClientSecret,
                audience = $"{AppSettings.IAMDomain}api/v2/",
                scope = "read:roles update:users"
            };

            var response = await _httpClient.PostAsync(url, new StringContent(
                JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json"));

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<dynamic>(content) ?? throw new Exception("Failed to retrieve access token.");
            return tokenResponse.access_token;
        }
    }

    public class TokenResponse
    {
        // [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

        public TokenResponse() {}

        public TokenResponse(string AccessToken) {
            this.AccessToken = AccessToken;
        }
    }

    public class JwksResponse
    {
        public List<Jwk> Keys { get; set; }
    }

    public class Auth0User
    {
        [JsonProperty("user_id")]
        public string UserId { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("nickname")]
        public string Nickname { get; set; }

        [JsonProperty("picture")]
        public string Picture { get; set; }

        [JsonProperty("identities")]
        public List<Identity> Identities { get; set; }
        
        public Auth0User() {}

        public Auth0User(string UserId) {
            this.UserId = UserId;
        }

        public Auth0User(string UserId, string Email, string Name, string Nickname, string Picture, List<Identity> Identities) {
            this.UserId = UserId;
            this.Email = Email;
            this.Name = Name;
            this.Nickname = Nickname;
            this.Picture = Picture;
            this.Identities = Identities;
        }
    }

    public class Identity
    {
        public string Provider { get; set; }
        public string Connection { get; set; }
        public string UserId { get; set; }
        public bool IsSocial { get; set; }
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