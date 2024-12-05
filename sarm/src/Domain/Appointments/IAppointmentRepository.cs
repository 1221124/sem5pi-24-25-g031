using Infrastructure.Shared;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;
using DDDNetCore.Domain.SurgeryRooms;
using DDDNetCore.Domain.OperationRequests;
using Domain.Staffs;


namespace DDDNetCore.Domain.Appointments
{
    public interface IAppointmentRepository : IRepository<Appointment, AppointmentId>
    {
        Task<List<Appointment>> GetByRoomAndDateAsync(SurgeryRoomNumber surgeryRoomNumber, DateTime date);
        Task<Appointment> GetByNumberAsync(AppointmentNumber appointmentNumber);
        Task<Appointment> GetByRequestCodeAsync(RequestCode requestCode);
        Task<List<Appointment>> GetByLicenseNumberAsync(LicenseNumber licenseNumber);
    }
}