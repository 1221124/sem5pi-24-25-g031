using System;
using System.Collections.Generic;
using System.ComponentModel;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public UserId? UserId { get; set; }
        public FullName FullName { get; set; }
        public LicenseNumber LicenseNumber { get; set; }
        public Specialization Specialization { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public Status Status { get; set; }
        public List<Slot> SlotAppointement { get; set; }
        public List<Slot> SlotAvailability { get; set; }

        public Staff()
        {
            // SlotAppointement = new List<Slot>();
            // SlotAvailability = new List<Slot>();
        }

        public Staff(LicenseNumber licenseNumber, FullName fullName, ContactInformation contactInformation, Specialization specialization)
        {
            Id = new StaffId(Guid.NewGuid());
            LicenseNumber = licenseNumber;
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            Status = Status.Pending;
            SlotAppointement = new List<Slot>();
            SlotAvailability = new List<Slot>();
        }

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

        public Staff(FullName fullName, ContactInformation contactInformation, Specialization specialization)
        {
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            SlotAppointement = new List<Slot>();
            SlotAvailability = new List<Slot>();
        }


        public Staff(Guid id, Email email, PhoneNumber phoneNumber, List<Slot> avalibilitySlots, Specialization specialization)
        {
            Id = new StaffId(id);
            ContactInformation = new ContactInformation(email, phoneNumber);
            Specialization = specialization;
            SlotAvailability = avalibilitySlots;
        }

        public void ChangeContactInformation(ContactInformation contactInformation)
        {
            ContactInformation = contactInformation;
        }

        public void ChangeLicenseNumber(LicenseNumber licenseNumber)
        {
            LicenseNumber = licenseNumber;
        }

        public void ChangeSpecialization(Specialization specialization)
        {
            Specialization = specialization;
        }

        public void ChangeSlotAvailability(List<Slot> slotAvailability)
        {
            SlotAvailability = slotAvailability;
        }

        public void ChangeUserId(UserId userId)
        {
            UserId = userId;
        }

        public void MarkAsInative()
        {
            Status = Status.Inactive;
        }
    }
}