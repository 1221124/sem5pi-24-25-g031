using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Add services to the container.
        services.AddControllers(); // Add MVC services
        // Add any other services, such as DbContext, repositories, etc.
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error"); // Use a generic error page
            app.UseHsts(); // Add HSTS in production
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers(); // Map attribute-routed controllers
            // Or endpoints.MapDefaultControllerRoute(); for conventional routing
        });
    }
}
