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
        private readonly PatientService _patientService;
        private readonly IServiceProvider _serviceProvider;
        private readonly DbLogService _dbLogService;
        private const int AddedTime = 1;

        public PatientCleanupService(Timer timer, PatientService patientService, IServiceProvider serviceProvider, DbLogService dbLogService)
        {
            _timer = timer;
            _patientService = patientService;
            _serviceProvider = serviceProvider;
            _dbLogService = dbLogService;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _timer = new Timer(async state => await CheckAndDeletePatients(stoppingToken), null, TimeSpan.Zero, TimeSpan.FromMinutes(4));
            return Task.CompletedTask; 
        }
        private async Task CheckAndDeletePatients(CancellationToken stoppingToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var repository = scope.ServiceProvider.GetRequiredService<DbLogRepository>();
        
                DateTime thresholdDate = DateTime.Now.AddMinutes(AddedTime);
                var dbLogsToDelete = await repository.GetByEntityLogTypeAsync(EntityType.Patient, DbLogType.Delete);
                foreach (var dbLog in dbLogsToDelete)
                {
                    if (dbLog != null && dbLog.TimeStamp <= thresholdDate && Regex.Match(dbLog.Message, @"Delete\s*\{[^}]*\}").Success)
                    {
                        var match = Regex.Match(dbLog.Message, @"\{([^}]*)\}");
                        var messageId = match.Groups[1].Value;
                        var patientId = new PatientId(messageId);
                        await _patientService.AdminDeleteAsync(patientId);
                        _dbLogService.LogAction(EntityType.Patient, DbLogType.Delete, $"Deleted {patientId.Value}");
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
