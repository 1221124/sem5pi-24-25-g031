using Domain.Shared;
using Domain.UsersSession;
using Microsoft.Extensions.Caching.Memory;

namespace Domain.Authz
{
    public class AuthorizationService
    {
        private readonly IMemoryCache _memoryCache;

        public AuthorizationService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public async Task AddTokenToCacheAsync(string accessToken)
        {
            _memoryCache.Set("accessToken", accessToken, TimeSpan.FromMinutes(60));
        }

        public async Task<string> GetTokenFromCacheAsync()
        {
            _memoryCache.TryGetValue("accessToken", out string accessToken);
            return accessToken;
        }

        public async Task RemoveTokenFromCacheAsync()
        {
            _memoryCache.Remove("accessToken");
        }

        public async Task<bool> IsTokenInCacheAsync()
        {
            return _memoryCache.TryGetValue("accessToken", out string accessToken);
        }
    }
}