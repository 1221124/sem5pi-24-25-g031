using Domain.Shared;

namespace DDDNetCore.src.Domain.Shared
{
    public class ContactInformation: IValueObject
    {
        public Email Email { get; set; }
        public PhoneNumber PhoneNumber { get; set; }

        public ContactInformation(Email email, PhoneNumber phoneNumber)
        {
            Email = email;
            PhoneNumber = phoneNumber;
        }
    }
}