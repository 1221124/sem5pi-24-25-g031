using DDDNetCore.Domain.Patients;
using Domain.Staffs;

namespace Domain.Emails;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task<(string subject, string body)> GenerateVerificationEmailContentSensitiveInfo(UpdatingPatientDto dto);
    Task<(string subject, string body)> GenerateVerificationRemoveEmailContentSensitiveInfo(UpdatingPatientDto dto);
    Task<(string subject, string body)> GenerateVerificationEmailContentSensitiveInfoStaff(String oldEmail, UpdatingStaffDto dto);
    String DecodeToken(string token);
    

}