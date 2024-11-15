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
    }
}