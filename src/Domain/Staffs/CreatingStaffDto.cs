using Domain.Shared;

namespace Domain.Staffs
{
    public class CreatingStaffDto
    {
        public FullName FullName { get; set; }
        public PhoneNumber PhoneNumber { get; set; }
        public Email Email { get; set; }
        public Specialization Specialization { get; set; }
        public RoleFirstChar RoleFirstChar { get; set; }

        public CreatingStaffDto(FullName fullName, PhoneNumber phoneNumber, Email email, Specialization specialization, RoleFirstChar roleFirstChar)
        {
            FullName = fullName;
            PhoneNumber = phoneNumber;
            Email = email;
            Specialization = specialization;
            RoleFirstChar = roleFirstChar;
        }

    }
}