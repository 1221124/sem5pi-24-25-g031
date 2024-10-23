using System;
using System.Collections.Generic;
using System.ComponentModel;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public UserId UserId { get; set; }
        public FullName FullName { get; set; }
        public Specialization Specialization { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public Status Status { get; set; }
        public List<Slot> SlotAppointement { get; set; }
        public List<Slot> SlotAvailability { get; set; }


        public Staff(StaffId staffId, UserId userId, FullName fullName, ContactInformation contactInformation, Specialization specialization, Status status)
        {
            Id = staffId;
            UserId = userId;
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            Status = status;
            SlotAppointement = new List<Slot>();
            SlotAvailability = new List<Slot>();
        }

        public Staff(UserId userId, FullName fullName, ContactInformation contactInformation, Specialization specialization, Status status)
        {
            UserId = userId;
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            Status = status;
            SlotAppointement = new List<Slot>();
            SlotAvailability = new List<Slot>();
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