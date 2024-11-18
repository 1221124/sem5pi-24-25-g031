using DDDNetCore.Domain.SurgeryRooms;
using Domain.SurgeryRooms;
using Infrastructure;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Infrastructure.SurgeryRooms
{
    public class SurgeryRoomRepository : BaseRepository<SurgeryRoom, SurgeryRoomId>, ISurgeryRoomRepository
    {
        private DbSet<SurgeryRoom> _objs; 
        
        public SurgeryRoomRepository(SARMDbContext context) : base(context.SurgeryRooms)
        {
            this._objs = context.SurgeryRooms;
        }

        public Task<SurgeryRoom> GetBySurgeryRoomNumberAsync(SurgeryRoomNumber surgeryRoomNumber)
        {
            return _objs.FirstOrDefaultAsync<SurgeryRoom>(x => x.SurgeryRoomNumber == surgeryRoomNumber);
        }
    }
}