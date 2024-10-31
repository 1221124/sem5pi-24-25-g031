namespace Domain.Authz
{
    public class IdTokenHeaderMiddleware
    {
        private readonly RequestDelegate _next;

        public IdTokenHeaderMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            Console.WriteLine("IdTokenHeaderMiddleware: Invoked.");

            var path = context.Request.Path.Value.ToLower();
            if (path == "/api/users/callback" || path == "/api/users/register" || path == "/api/users/login")
            {
                await _next(context);
                return;
            }

            var idToken = context.Session.GetString("IdToken");
            var accessToken = context.Session.GetString("AccessToken");

            Console.WriteLine("IdTokenHeaderMiddleware: idToken from session: " + idToken);
            Console.WriteLine("IdTokenHeaderMiddleware: accessToken from session: " + accessToken);

            if (!string.IsNullOrEmpty(accessToken))
            {
                Console.WriteLine("IdTokenHeaderMiddleware: Adding accessToken to request headers.");
                context.Request.Headers["Authorization"] = $"Bearer {accessToken}";
                Console.WriteLine("IdTokenHeaderMiddleware: Added accessToken to request headers.");
            }
            else
            {
                Console.WriteLine("IdTokenHeaderMiddleware: AccessToken is null or empty.");
            }

            Console.WriteLine("IdTokenHeaderMiddleware: Calling next middleware.");
            await _next(context);
        }
    }
}