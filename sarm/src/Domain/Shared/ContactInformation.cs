namespace Domain.Shared
{
    public class ContactInformation : IValueObject
    {
        public Email Email { get; set; }
        public PhoneNumber PhoneNumber { get; set; }
        public ContactInformation(Email email, PhoneNumber phoneNumber)
        {
            if (email == null) 
            {
                throw new ArgumentNullException(nameof(email), "Email cannot be null");
            }
        
            if (phoneNumber == null) 
            {
                throw new ArgumentNullException(nameof(phoneNumber), "PhoneNumber cannot be null");
            }
            
            Email = email;
            PhoneNumber = phoneNumber;
        }
        
        public override bool Equals(object obj)
        {
            if (obj is ContactInformation other)
            {
                return Email.Equals(other.Email) && PhoneNumber.Equals(other.PhoneNumber);
            }
            return false;
        }

        public override int GetHashCode()
        {
            // Combina os valores de hash de Email e PhoneNumber
            return HashCode.Combine(Email, PhoneNumber);
        }

        /*public ContactInformation()
        {
        }*/

    }
}