using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.Staff
{
    public class StaffDto
    {
        public Guid Id { get; set; }
        public FullName FullName { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public string LicenseNumber { get; set; }
        public Specialization Specialization { get; set; }
        public Status Status { get; set; }
        public List<Slot> Slot { get; set; }

        public StaffDto(Guid id, FullName fullName, ContactInformation contactInformation, string licenseNumber, Specialization specialization, Status status, List<Slot> slot)
        {
            Id = id;
            FullName = fullName;
            ContactInformation = contactInformation;
            LicenseNumber = licenseNumber;
            Specialization = specialization;
            Status = status;
            Slot = slot;
        }
    }
}