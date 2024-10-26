using Domain.IAM;
using Domain.Shared;
using Domain.Users;
using Domain.UsersSession;

namespace Domain.Authz 
{
    public class TokenInjectionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly SessionService _sessionService;
        private readonly UserService _userService;
        private readonly IAMService _iamService;

        public TokenInjectionMiddleware(RequestDelegate next, SessionService sessionService, UserService userService, IAMService iamService)
        {
            _next = next;
            _sessionService = sessionService;
            _userService = userService;
            _iamService = iamService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity.IsAuthenticated)
            {
                var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                try
                {
                    // ClaimsPrincipal claimsPrincipal;
                    // try
                    // {
                    //     claimsPrincipal = await _iamService.ValidateTokenAsync(token);
                    // }
                    // catch (Exception ex)
                    // {
                    //     context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    //     await context.Response.WriteAsync("Invalid token: " + ex.Message);
                    //     return;
                    // }

                    var email = _iamService.GetEmailFromIdToken(token);
                    
                    if (!string.IsNullOrEmpty(email))
                    {
                        var user = await _userService.GetByEmailAsync(new Email(email));
                        
                        if (user != null)
                        {
                            var userId = new UserId(user.Id);
                            var userSession = await _sessionService.GetSessionAsync(userId);

                            if (userSession != null && !string.IsNullOrEmpty(userSession.IdToken))
                            {
                                context.Request.Headers["Authorization"] = $"Bearer {userSession.IdToken}";
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync($"Unauthorized: {ex.Message}");
                }
            }

            await _next(context);
        }
    }
}
