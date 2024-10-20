using Domain.Shared;

namespace Domain.Staff
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public int StaffId { get; set; }

        public FullName FullName { get; set; }

        public int LicenseNumber { get; set; }

        public Specialization Specialization { get; set; }

        public ContactInformation ContactInformation { get; set; }

        public Status status { get; set; }

        public Staff(FullName fullName, int licenseNumber, Specialization specialization, ContactInformation contactInformation, Status status)
        {
            FullName = fullName;
            LicenseNumber = licenseNumber;
            Specialization = specialization;
            ContactInformation = contactInformation;
            this.status = status;
        }
    }
}