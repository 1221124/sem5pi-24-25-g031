// namespace Domain.Authz
// {
//     public class IdTokenHeaderMiddleware
//     {
//         private readonly RequestDelegate _next;

//         public IdTokenHeaderMiddleware(RequestDelegate next)
//         {
//             _next = next;
//         }

//         public async Task Invoke(HttpContext context)
//         {
//             Console.WriteLine("IdTokenHeaderMiddleware: Invoked.");

//             // var path = context.Request.Path.Value.ToLower();
//             // if (path == "/api/Users/callback" || path == "/api/Users/register" || path == "/api/Users/login")
//             if (context.Request.Path.StartsWithSegments("/api/Users/callback", StringComparison.OrdinalIgnoreCase)
//             || context.Request.Path.StartsWithSegments("/api/Users/register", StringComparison.OrdinalIgnoreCase)
//             || context.Request.Path.StartsWithSegments("/api/Users/login", StringComparison.OrdinalIgnoreCase))
//             // || context.Session.GetString("Authenticated") != "true")
//             {
//                 await _next(context);
//                 return;
//             }

//             if (context.Session.IsAvailable)
//             {
//                 Console.WriteLine("IdTokenHeaderMiddleware: Session is available.");
//                 Console.WriteLine($"IdTokenHeaderMiddleware: Session ID - {context.Session.Id}");
//             }
//             else
//             {
//                 Console.WriteLine("IdTokenHeaderMiddleware: Session is NOT available.");
//             }

//             var accessToken = context.Session.GetString("AccessToken");
//             Console.WriteLine("IdTokenHeaderMiddleware: accessToken from session: " + accessToken);

//             if (string.IsNullOrEmpty(accessToken))
//             {
//                 Console.WriteLine("IdTokenHeaderMiddleware: accessToken is null or empty.");
//                 context.Response.StatusCode = 401;
//                 return;
//             }
//             else
//             {
//                 Console.WriteLine("IdTokenHeaderMiddleware: Trying to add access token");
//                 context.Request.Headers["Authorization"] = $"Bearer {accessToken}";
//                 Console.WriteLine("IdTokenHeaderMiddleware: Added Authorization header.");
//             }

//             Console.WriteLine("IdTokenHeaderMiddleware: Calling next middleware.");
//             await _next(context);
//         }
//     }
// }