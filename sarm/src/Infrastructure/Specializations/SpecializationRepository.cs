using DDDNetCore.Domain.Specializations;
using Domain.Shared;
using Infrastructure;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using Specialization = DDDNetCore.Domain.Specializations.Specialization;

namespace DDDNetCore.src.Infrastructure.Specializations{

    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISpecializationRepository
    {
        private DbSet<Specialization> _objs;

        public SpecializationRepository(SARMDbContext context) : base(context.Specializations)
        {
            _objs = context.Set<Specialization>();
        }

        public Task<Specialization> GetByCodeAsync(SNOMEDCTCode snomedctCode)
        {
            return _objs.FirstOrDefaultAsync(x => x.SNOMEDCTCode == snomedctCode);
        }

        public Task<List<Specialization>> GetByNameAsync(Name name)
        {
            return _objs.Where(x => x.Name == name).ToListAsync();
        }

        public Task<List<Specialization>> GetByDescriptionAsync(Description description)
        {
            return _objs.Where(x => x.Description == description).ToListAsync();
        }

        public async Task<string?> GetLastCodeAsync()
        {
            var last = await _objs
                .AsQueryable()
                .OrderByDescending(x => x.SNOMEDCTCode)
                .FirstOrDefaultAsync();

            return last?.SNOMEDCTCode;
        }
    }
}