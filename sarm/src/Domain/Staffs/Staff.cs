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
        public StaffRole StaffRole { get; set; }
        public ContactInformation ContactInformation { get; set; }
        public Status Status { get; set; }
        public List<Slot> SlotAppointement { get; set; }
        public List<Slot> SlotAvailability { get; set; }

        public Staff()
        {
            // SlotAppointement = new List<Slot>();
            // SlotAvailability = new List<Slot>();
        }

        public Staff(LicenseNumber licenseNumber, FullName fullName, ContactInformation contactInformation, Specialization specialization, StaffRole staffRole)
        {
            Id = new StaffId(Guid.NewGuid());
            LicenseNumber = licenseNumber;
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            StaffRole = staffRole;
            Status = Status.Active;
            SlotAppointement = new List<Slot>();
            SlotAvailability = new List<Slot>();
        }

        public Staff(StaffId staffId, UserId userId, FullName fullName, ContactInformation contactInformation, Specialization specialization, StaffRole staffRole, Status status)
        {
            Id = staffId;
            UserId = userId;
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            StaffRole = staffRole;
            Status = status;
            SlotAppointement = new List<Slot>();
            SlotAvailability = new List<Slot>();
        }

        public Staff(FullName fullName, ContactInformation contactInformation, Specialization specialization, StaffRole staffRole)
        {
            FullName = fullName;
            ContactInformation = contactInformation;
            Specialization = specialization;
            StaffRole = staffRole;
            SlotAppointement = new List<Slot>();
            SlotAvailability = new List<Slot>();
        }


        public Staff(Guid id, Email email, PhoneNumber phoneNumber, List<Slot> avalibilitySlots, Specialization specialization, StaffRole staffRole)
        {
            Id = new StaffId(id);
            ContactInformation = new ContactInformation(email, phoneNumber);
            Specialization = specialization;
            StaffRole = staffRole;
            SlotAvailability = avalibilitySlots;
        }

        public void ChangeContactInformation(ContactInformation contactInformation)
        {
            ContactInformation = contactInformation;
        }
        
        public void ChangePhoneNumber(PhoneNumber phoneNumber)
        {
            ContactInformation.PhoneNumber = phoneNumber;
        }

        public void ChangeEmail(Email email)
        {
            ContactInformation.Email = email;
        }

        public void ChangeLicenseNumber(LicenseNumber licenseNumber)
        {
            LicenseNumber = licenseNumber;
        }

        public void ChangeSpecialization(Specialization specialization)
        {
            Specialization = specialization;
        }

        public void ChangeStatus(Status status)
        {
            Status = status;
        }

        public void ChangeSlotAvailability(List<Slot> slotAvailability)
        {
            SlotAvailability = slotAvailability;
        }

        public void ChangeUserId(UserId userId)
        {
            UserId = userId;
        }

        public void AddAppointmentSlot(Slot slot)
        {
            SlotAppointement.Add(slot);
        }

        public void AddAvailabilitySlot(Slot slot)
        {
            SlotAvailability.Add(slot);
        }

        public void MarkAsInative()
        {
            Status = Status.Inactive;
        }

        public override bool Equals(object? obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }
            return LicenseNumber == ((Staff)obj).LicenseNumber;
        }
    }
}