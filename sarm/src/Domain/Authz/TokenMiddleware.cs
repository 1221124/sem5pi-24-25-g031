using Microsoft.Extensions.Caching.Memory;

namespace Domain.Authz
{
    public class TokenMiddleware
    {
        private readonly RequestDelegate _next;

        public TokenMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IMemoryCache _memoryCache)
        {
            // var path = context.Request.Path.Value.ToLower();
            // if (path == "/api/Users/callback" || path == "/api/Users/register" || path == "/api/Users/login")
            if (context.Request.Path.StartsWithSegments("/api/Users/callback", StringComparison.OrdinalIgnoreCase)
            || context.Request.Path.StartsWithSegments("/api/Users/register", StringComparison.OrdinalIgnoreCase)
            || context.Request.Path.StartsWithSegments("/api/Users/login", StringComparison.OrdinalIgnoreCase))
            // || context.Session.GetString("Authenticated") != "true")
            {
                await _next(context);
                return;
            }

            Console.WriteLine("IdTokenHeaderMiddleware: Invoked.");

            if (context.Session.IsAvailable)
            {
                Console.WriteLine("IdTokenHeaderMiddleware: Session is available.");
                Console.WriteLine($"IdTokenHeaderMiddleware: Session ID - {context.Session.Id}");
            }
            else
            {
                Console.WriteLine("IdTokenHeaderMiddleware: Session is NOT available.");
            }

            _memoryCache.TryGetValue("accessToken", out string accessToken);

            if (string.IsNullOrEmpty(accessToken))
            {
                Console.WriteLine("IdTokenHeaderMiddleware: accessToken is null or empty.");
                context.Response.StatusCode = 401;
                return;
            }
            else
            {
                Console.WriteLine("IdTokenHeaderMiddleware: Found access token in memory cache.");
                Console.WriteLine("IdTokenHeaderMiddleware: Trying to add access token");
                context.Request.Headers["Authorization"] = $"Bearer {accessToken}";
                Console.WriteLine("IdTokenHeaderMiddleware: Added Authorization header.");
            }

            Console.WriteLine("IdTokenHeaderMiddleware: Calling next middleware.");
            await _next(context);
        }
    }
}