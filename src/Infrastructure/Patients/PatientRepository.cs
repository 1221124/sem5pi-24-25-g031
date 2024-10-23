using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Patients;
using Domain.Shared;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>, IPatientRepository
    {
        private DbSet<Patient> _objs;
        public PatientRepository(SARMDbContext context):base(context.Patients)
        {
            this._objs = context.Patients;
        }

        public async Task<Patient> getByPhoneNumberAsync(PhoneNumber phoneNumber)
        {
            return await _objs.
                FirstOrDefaultAsync(p => p.ContactInformation.PhoneNumber == phoneNumber);
        }

        public async Task<Patient> GetByEmailAsync(Email email)
        {
            return await _objs.
                FirstOrDefaultAsync(p => p.ContactInformation.Email == email);
        }
    }
}