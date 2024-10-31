using System.Text.RegularExpressions;
using Domain.DbLogs;
using Domain.Patients;
using Infrastructure.DbLogs;
using Microsoft.CodeAnalysis.Elfie.Serialization;

namespace DDDNetCore.Domain.Patients
{
    public class PatientCleanupService : BackgroundService
    {
        private Timer _timer;
        private readonly IServiceProvider _serviceProvider;
        private readonly DbLogService _dbLogService;
        private readonly ILogger<PatientCleanupService> _logger;
        private const int AddedTime = 1;

        public PatientCleanupService(IServiceProvider serviceProvider, DbLogService dbLogService, ILogger<PatientCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _dbLogService = dbLogService;
            _logger = logger;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Starting Patient Cleanup Service...");
            _timer = new Timer(async state => await CheckAndDeletePatients(stoppingToken), null, TimeSpan.Zero, TimeSpan.FromSeconds(30));
            return Task.CompletedTask; 
        }
        private async Task CheckAndDeletePatients(CancellationToken stoppingToken)
        {
            Console.Out.WriteLine("Before Using");
            using (var scope = _serviceProvider.CreateScope())
            {
                Console.Out.WriteLine("After Using");
                var repository = scope.ServiceProvider.GetRequiredService<DbLogRepository>();
                var patientService = scope.ServiceProvider.GetRequiredService<PatientService>();
        
                DateTime thresholdDate = DateTime.Now.AddMinutes(AddedTime);
                var dbLogsToDelete = await repository.GetByEntityLogTypeAsync(EntityType.Patient, DbLogType.Delete);
                foreach (var dbLog in dbLogsToDelete)
                {
                    Console.Out.WriteLine("In For");
                    if (dbLog != null && dbLog.TimeStamp <= thresholdDate && Regex.Match(dbLog.Message, "^Pre-Deleted", RegexOptions.IgnoreCase).Success)
                    {
                        Console.Out.WriteLine("In If");
                        var match = Regex.Match(dbLog.Message, @"\{([^}]*)\}");
                        var messageId = match.Groups[1].Value;
                        var patientId = new PatientId(messageId);
                        
                        await patientService.DeleteAsync(patientId);
                        _dbLogService.LogAction(EntityType.Patient, DbLogType.Delete, "Deleted {" + patientId.Value + "}");
                    }
                }
            }
        }
        
        public override async Task StopAsync(CancellationToken stoppingToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            await base.StopAsync(stoppingToken);
        }
        
    }
}
