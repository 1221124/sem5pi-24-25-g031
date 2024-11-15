using DDDNetCore.Domain.Appointments;
using DDDNetCore.Domain.Surgeries;
using Infrastructure;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Infrastructure.Surgeries
{
    public class SurgeryRepository : BaseRepository<Surgery, SurgeryId>, ISurgeryRepository
    {
        private DbSet<Surgery> _objs; 
        
        public SurgeryRepository(SARMDbContext context) : base(context.Surgeries)
        {
            this._objs = context.Surgeries;
        }

        public async Task<Surgery?> GetBySurgeryNumberAsync(SurgeryNumber surgeryNumber)
        {
            return await _objs.FirstOrDefaultAsync(a => a.SurgeryNumber.Equals(surgeryNumber));
        }
    }
}