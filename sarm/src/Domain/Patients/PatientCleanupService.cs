// using Domain.DBLogs;
// using Domain.Patients;
// using Infrastructure.DBLogs;
//
// namespace DDDNetCore.Domain.Patients
// {
//     public class PatientCleanupService : BackgroundService
//     {
//         private Timer _timer;
//         private readonly PatientService _patientService;
//         private readonly IServiceProvider _serviceProvider;
//         
//         protected override Task ExecuteAsync(CancellationToken stoppingToken)
//         {
//             _timer = new Timer(async state => await CheckAndDeletePatients(stoppingToken), null, TimeSpan.Zero, TimeSpan.FromHours(24));
//             return Task.CompletedTask; 
//         }
//
//         private async Task CheckAndDeletePatients(CancellationToken stoppingToken)
//         {
//             using (var scope = _serviceProvider.CreateScope())
//             {
//                 var repository = scope.ServiceProvider.GetRequiredService<DBLogRepository>();
//         
//                 DateTime thresholdDate = DateTime.Now.AddDays(-30);
//                 var dbLogsToDelete = await repository.GetByEntityLogTypeAsync(EntityType.PATIENT, DbLogType.DELETE);
//
//                 foreach (var dbLog in dbLogsToDelete)
//                 {
//                     if (dbLog != null && dbLog.TimeStamp <= thresholdDate)
//                     {
//                         var patientId = new PatientId(dbLog.Affected);
//                         await _patientService.AdminDeleteAsync(patientId);
//                     }
//                 }
//             }
//         }
//
//         
//
//         public override async Task StopAsync(CancellationToken stoppingToken)
//         {
//             _timer?.Change(Timeout.Infinite, 0);
//             await base.StopAsync(stoppingToken);
//         }
//         
//     }
// }
//
