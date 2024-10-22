namespace Domain.Shared
{
    public class ContactInformation : IValueObject
    {
        public Email Email { get; set; }
        public PhoneNumber PhoneNumber { get; set; }

        public ContactInformation(Email email, PhoneNumber phoneNumber)
        {
            Email = email;
            PhoneNumber = phoneNumber;
        }

        public override bool Equals(object obj)
        {
            var other = obj as ContactInformation;

            if (ReferenceEquals(other, null))
                return false;

            return Email == other.Email && PhoneNumber == other.PhoneNumber;
        }

        public override int GetHashCode()
        {
            return Email.GetHashCode() ^ PhoneNumber.GetHashCode();
        }

    }
}