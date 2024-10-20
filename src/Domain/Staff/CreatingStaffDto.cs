using Domain.Shared;

namespace Domain.Staff
{
    public class CreatingStaffDto
    {
        public FullName FullName { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public string LicenseNumber { get; set; }
        public Specialization Specialization { get; set; }
        public Status Status { get; set; }
        public List<Slot> Slot { get; set; }

        public CreatingStaffDto(FullName fullName, ContactInformation contactInformation, string licenseNumber, Specialization specialization, Status status, List<Slot> slot)
        {
            FullName = fullName;
            ContactInformation = contactInformation;
            LicenseNumber = licenseNumber;
            Specialization = specialization;
            Status = status;
            Slot = slot;
        }

    }
}