using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class CreatingStaffDto
    {
        //public string UserId { get; set; }
        public FullName FullName { get; set; }
        public ContactInformation ContactInformation { get; set; }
        //  public string LicenseNumber { get; set; }
        public Specialization Specialization { get; set; }
        public Status Status { get; set; }
        //  public List<Slot> Slot { get; set; }

        public CreatingStaffDto(FullName fullName, ContactInformation contactInformation, Specialization specialization, Status status)
        {
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            Status = status;
        }



    }
}