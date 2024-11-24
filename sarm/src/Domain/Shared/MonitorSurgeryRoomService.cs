using DDDNetCore.Domain.Surgeries;

public class MonitorSurgeryRoomService : IHostedService, IDisposable
{
    private readonly IServiceScopeFactory _scopeFactory;
    private Timer _timer;
    private readonly object _lock = new object();

    public MonitorSurgeryRoomService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _timer = new Timer(ExecuteRoomMonitoring, null, TimeSpan.Zero, TimeSpan.FromMinutes(1));

        return Task.CompletedTask;
    }

    private void ExecuteRoomMonitoring(object state)
    {
        lock (_lock) {
            using (var scope = _scopeFactory.CreateScope())
            {
                var surgeryRoomService = scope.ServiceProvider.GetRequiredService<SurgeryRoomService>();
                
                surgeryRoomService.UpdateRoomStatusesAsync().GetAwaiter().GetResult();
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}