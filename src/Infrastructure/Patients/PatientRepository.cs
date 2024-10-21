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

        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            // cf. https://www.entityframeworktutorial.net/efcore/fluent-api-in-entity-framework-core.aspx
            
            //builder.ToTable("Categories", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
            //builder.Property<bool>("_active").HasColumnName("Active");
        }
    }
}