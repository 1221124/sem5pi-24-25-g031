using DDDNetCore.Domain.Appointments;
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

        public async Task<List<Appointment>> GetByDateAsync(DateTime date)
        {
            return await _objs.Where(x => x.AppointmentDate.Start.Date == date.Date).ToListAsync();
        }
    }
}