using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class CreatingStaffDto
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string ContactInformation { get; set; }
        public string LicenseNumber { get; set; }
        public string Specialization { get; set; }
        public string Status { get; set; }
        public List<Slot> Slot { get; set; }

        public CreatingStaffDto(string userId, string fullName, string contactInformation, string licenseNumber, string specialization, string status, List<Slot> slot)
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