using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Staffs;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Appointments
{
    public class AppointmentRepository : BaseRepository<Appointment, AppointmentId>, IAppointmentRepository
    {

        private DbSet<Appointment> _objs; 
        
        public AppointmentRepository(SARMDbContext context):base(context.Appointments)
        {
            this._objs = context.Appointments;
        }

        public async Task<List<Appointment>> GetByRoomAndDateAsync(SurgeryRoomNumber surgeryRoomNumber, DateTime date)
        {
            return await _objs.Where(x => x.SurgeryRoomNumber == surgeryRoomNumber && x.AppointmentDate.Start.Date == date.Date).ToListAsync();
        }

        public async Task<Appointment> GetByNumberAsync(AppointmentNumber appointmentNumber)
        {
            return await _objs.Where(x => x.AppointmentNumber == appointmentNumber).FirstOrDefaultAsync();
        }

        public async Task<Appointment> GetByRequestCodeAsync(RequestCode requestCode)
        {
            return await _objs.Where(x => x.RequestCode == requestCode).FirstOrDefaultAsync();
        }

        public async Task<List<Appointment>> GetByLicenseNumberAsync(LicenseNumber licenseNumber)
        {
            return await _objs.Where(x => x.AssignedStaff.Contains(licenseNumber)).ToListAsync();
        }
    }
}