using DDDNetCore.Domain.Patients;
using DDDNetCore.Infrastructure.Patients;
using Infrastructure;
using Infrastructure.OperationTypes;
using Infrastructure.OperationRequests;
using Infrastructure.Users;
using Infrastructure.StaffRepository;
using Domain.OperationTypes;
using Domain.OperationRequests;
using Domain.Users;
using Domain.Patients;
using Domain.Staffs;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Infrastructure.Shared;
using Newtonsoft.Json.Serialization;
using Domain.Emails;
using Domain.IAM;
using Infrastructure.UsersSession;
using Domain.UsersSession;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Domain.Authz;
using Domain.DbLogs;
using Infrastructure.DbLogs;
using Microsoft.OpenApi.Models;
using System.Text;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

AppSettings.Initialize(builder.Configuration);

builder.Services.AddMemoryCache();

builder.Services.AddHttpClient<IAMService>();

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    });

builder.Services.AddDbContext<SARMDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
    .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "V1" });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please insert your Bearer token",
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] {}
            }
        });
    });

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();

builder.Services.AddTransient<IOperationTypeRepository, OperationTypeRepository>();
builder.Services.AddTransient<OperationTypeService>();

builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<UserService>();

builder.Services.AddTransient<OperationRequestRepository>();
builder.Services.AddTransient<IOperationRequestRepository, OperationRequestRepository>();
builder.Services.AddTransient<OperationRequestService>();

builder.Services.AddTransient<IPatientRepository, PatientRepository>();
builder.Services.AddTransient<PatientService>();

builder.Services.AddTransient<IStaffRepository, StaffRepository>();
builder.Services.AddTransient<StaffService>();

builder.Services.AddTransient<IDbLogRepository, DbLogRepository>();
builder.Services.AddTransient<DbLogService>();

builder.Services.AddTransient<UsersSessionRepository>();
builder.Services.AddTransient<IUserSessionRepository, UsersSessionRepository>();
builder.Services.AddTransient<SessionService>();

builder.Services.AddTransient<AuthorizationService>();

builder.Services.AddSingleton<IEmailService>(new EmailService("sarmg031@gmail.com", "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"));

builder.Services.AddTransient<PatientCleanupService>();

builder.Services.AddSingleton(new EmailService("sarmg031@gmail.com", "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"));

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidIssuer = AppSettings.IAMDomain,
            ValidateAudience = false,
            ValidAudience = AppSettings.IAMAudience,
            ClockSkew = TimeSpan.Zero
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                Console.WriteLine("Token validated successfully!");
            }
        };
    });

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty;
    });
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios.
    app.UseHsts();
}

// app.Use(async (context, next) =>
// {
//     var token = context.Request.Headers["Authorization"].ToString();
//     Console.WriteLine($"Token: {token}");

//     await next.Invoke();
// });

app.UseHttpsRedirection();
app.UseRouting();
app.UseSession();

// app.UseMiddleware<TokenMiddleware>();
using (var scope = app.Services.CreateScope())
{
    var iamService = scope.ServiceProvider.GetRequiredService<IAMService>();
    var publicKey = await iamService.GetPublicKeyAsync();

    app.UseAuthentication();
    app.UseAuthorization();
    app.Use(async (context, next) =>
    {
        var options = context.RequestServices.GetRequiredService<IOptions<JwtBearerOptions>>().Value;
        options.TokenValidationParameters.IssuerSigningKey = publicKey;

        await next();
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();