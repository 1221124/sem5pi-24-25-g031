using System;
using System.Collections.Generic;
using System.ComponentModel;
using Domain.Shared;
using Domain.Users;

namespace Domain.Staffs
{
    public class StaffDto
    {
        public Guid Id { get; set; }
        public UserId UserId { get; set; }
        public StaffId StaffId { get; set; }
        public FullName FullName { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public LicenseNumber LicenseNumber { get; set; }
        public Specialization Specialization { get; set; }
        public Status Status { get; set; }
        public List<Slot> SlotAppointement { get; set; }
        public List<Slot> SlotAvailability { get; set; }

        public StaffDto()
        {
        }

        public StaffDto(Guid id, UserId userId, FullName fullName, ContactInformation contactInformation, LicenseNumber licenseNumber, Specialization specialization, Status status, List<Slot> slot)
        {
            Id = id;
            UserId = userId;
            FullName = fullName;
            ContactInformation = contactInformation;
            LicenseNumber = licenseNumber;
            Specialization = specialization;
            Status = status;
            SlotAppointement = slot;
            SlotAvailability = slot;
        }
    }
}