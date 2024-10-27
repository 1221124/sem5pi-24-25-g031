// namespace Domain.Authz
// {
//     public class IdTokenHeaderMiddleware
//     {
//         private readonly RequestDelegate _next;

//         public IdTokenHeaderMiddleware(RequestDelegate next)
//         {
//             _next = next;
//         }

//         public async Task InvokeAsync(HttpContext context)
//         {
//             var idToken = context.Session.GetString("idToken");
//             if (!string.IsNullOrEmpty(idToken))
//             {
//                 context.Request.Headers.Add("Authorization", $"Bearer {idToken}");
//             }

//             await _next(context);
//         }
//     }
// }