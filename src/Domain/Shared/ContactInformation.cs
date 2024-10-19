namespace DDDNetCore.src.Domain.Shared
{
    public class ContactInformation
    {
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public ContactInformation(string email, string phoneNumber)
        {
            Email = email;
            PhoneNumber = phoneNumber;
        }
    }
}