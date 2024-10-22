using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class CreatingStaffDto
    {
        public UserId UserId { get; set; }
        public FullName FullName { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public string LicenseNumber { get; set; }
        public Specialization Specialization { get; set; }
        public Status Status { get; set; }
        public List<Slot> Slot { get; set; }

        public CreatingStaffDto(UserId userId, FullName fullName, ContactInformation contactInformation, string licenseNumber, Specialization specialization, Status status, List<Slot> slot)
        {
            UserId = userId;
            FullName = fullName;
            ContactInformation = contactInformation;
            LicenseNumber = licenseNumber;
            Specialization = specialization;
            Status = status;
            Slot = slot;
        }

    }
}