using DDDNetCore.Domain.Patients;

namespace Domain.Emails;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task<(string subject, string body)> GenerateVerificationEmailContentSensitiveInfo(UpdatingPatientDto dto);
    Task<(string subject, string body)> GenerateVerificationRemoveEmailContentSensitiveInfo(UpdatingPatientDto dto);
    String DecodeToken(string token);
    

}