using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Infrastructure;
using Infrastructure.OperationTypes;
using Infrastructure.Shared;
using Domain.Shared;
using Domain.OperationTypes;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;

        FirebaseApp.Create(new AppOptions()
        {
            Credential = GoogleCredential.FromFile("sem5-pi-24-25-g061-firebase-adminsdk-wo55l-834164845b.json"),
        });
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddDbContext<DDDSample1DbContext>(opt =>
            opt.UseInMemoryDatabase("DDDSample1DB")
            .ReplaceService<IValueConverterSelector, StronglyEntityIdValueConverterSelector>());

        ConfigureMyServices(services);
        

        services.AddControllers().AddNewtonsoftJson();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }

    public void ConfigureMyServices(IServiceCollection services)
    {
        services.AddTransient<IUnitOfWork,UnitOfWork>();

        services.AddTransient<IOperationTypeRepository,OperationTypeRepository>();
        services.AddTransient<OperationTypeService>();
    }
}
