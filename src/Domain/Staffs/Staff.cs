using System;
using System.Collections.Generic;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public UserId UserId { get; set; }
        public FullName FullName { get; set; }
        public LicenseNumber LicenseNumber { get; set; }
        public Specialization Specialization { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public Status Status { get; set; }
        public List<Slot> SlotAppointement { get; set; }
        public List<Slot> SlotAvailability { get; set; }

        public Staff() { }
        
        public Staff(FullName fullName, ContactInformation contactInformation, LicenseNumber licenseNumber, Specialization specialization, Status status, List<Slot> slot)
        {
            Id = new StaffId(new Guid());
            FullName = fullName;
            ContactInformation = contactInformation;
            LicenseNumber = licenseNumber;
            Specialization = specialization;
            Status = status;
            SlotAppointement = slot;
            SlotAvailability = slot;
        }

        public void ChangeContactInformation(ContactInformation contactInformation)
        {
            ContactInformation = contactInformation;
        }

        public void ChangeSpecialization(Specialization specialization)
        {
            Specialization = specialization;
        }

        public void ChangeSlotAvailability(List<Slot> slotAvailability)
        {
            SlotAvailability = slotAvailability;
        }

        public void MarkAsInative()
        {
            this.Status = Status.Inactive;
        }
    }
}