using DDDNetCore.Domain.Patients;
using Domain.Patients;
using Domain.Shared;
using Infrastructure;
using Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDNetCore.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>, IPatientRepository
    {
        private readonly DbSet<Patient> _objs;
        
        public PatientRepository(SARMDbContext context):base(context.Patients)
        {
            this._objs = context.Patients;
        }

        public async Task<Patient?> GetByPhoneNumberAsync(PhoneNumber phoneNumber)
        {
            return await _objs
                .AsQueryable().Where(x=> phoneNumber.Equals(x.ContactInformation.PhoneNumber)).FirstOrDefaultAsync();
            
        }

        public async Task<Patient?> GetByEmailAsync(Email email)
        {
            try {
                Console.WriteLine("Email: " + email);
                var a = await _objs
                    .AsQueryable().Where(x=> email.Equals(x.ContactInformation.Email)).FirstOrDefaultAsync();

                Console.WriteLine("Patient: " + a);

                return a;
            } catch (Exception e) {
                Console.WriteLine("####################Error: " + e);
                return null;
            }
        }
        
        public async Task<List<Patient?>> GetByName(Name firstName, Name lastName)
        {
            return (await _objs
                .AsQueryable().Where(x=> firstName.Equals(x.FullName.FirstName)).Where(x=> lastName.Equals(x.FullName.LastName)).ToListAsync())!;
        }
        
        public async Task<Patient?> GetByMedicalRecordNumberAsync(MedicalRecordNumber medicalRecordNumber)
        {
            return await _objs
                .AsQueryable().Where(x=> medicalRecordNumber.Equals(x.MedicalRecordNumber)).FirstOrDefaultAsync();
        }
        
        public async Task<List<Patient?>> GetByDateOfBirthAsync(DateOfBirth dateOfBirth)
        {
            return (await _objs
                .AsQueryable().Where(x=> dateOfBirth.Equals(x.DateOfBirth)).ToListAsync())!;
        }
        
        public async Task<List<Patient?>> GetByGenderAsync(Gender gender)
        {
            return (await _objs
                .AsQueryable().Where(x => gender.Equals(x.Gender)).ToListAsync())!;
        }
    }
}