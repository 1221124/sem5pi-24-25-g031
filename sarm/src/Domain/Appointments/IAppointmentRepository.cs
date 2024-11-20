using Infrastructure.Shared;
using Domain.Shared;
using Microsoft.EntityFrameworkCore;


namespace DDDNetCore.Domain.Appointments
{
    public interface IAppointmentRepository : IRepository<Appointment, AppointmentId>
    {
        Task<List<Appointment>> GetByDateAsync(DateTime date);
    }
}