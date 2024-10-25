using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class UpdatingStaffDto
    {
        public Email Email { get; set; }
        public PhoneNumber PhoneNumber { get; set; }
        public List<Slot> AvailabilitySlots { get; set; }
        public Specialization Specialization { get; set; }

        public UpdatingStaffDto(Email email, PhoneNumber phoneNumber, List<Slot> availabilitySlots, Specialization specialization)
        {
            Email = email;
            PhoneNumber = phoneNumber;
            AvailabilitySlots = availabilitySlots;
            Specialization = specialization;
        }



    }
}