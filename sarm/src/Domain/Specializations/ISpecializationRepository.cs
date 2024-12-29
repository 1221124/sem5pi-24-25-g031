using Domain.Shared;

namespace DDDNetCore.Domain.Specializations
{
    public interface ISpecializationRepository : IRepository<Specialization, SpecializationId>
    {
        Task<Specialization> GetByCodeAsync(SNOMEDCTCode snomedcCode);
        Task<List<Specialization>> GetByNameAsync(Name name);
        Task<List<Specialization>> GetByDescriptionAsync(Description description);
        Task<string?> GetLastCodeAsync();
    }
}