using DDDNetCore.Domain.Surgeries;
using Domain.Shared;

namespace DDDNetCore.Domain.Appointments{
    public interface ISurgeryRepository : IRepository<Surgery, SurgeryId>
    {

    //GetBySurgeryNumberAsync
    public Task<Surgery?> GetBySurgeryNumberAsync(SurgeryNumber surgeryNumber);
    }
}