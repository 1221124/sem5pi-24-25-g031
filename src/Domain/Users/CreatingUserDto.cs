using Domain.Shared;

namespace Domain.Users

{
    public class CreatingUserDto
    {
        public Email Email { get; set; }
        public Role Role { get; set; }

        public CreatingUserDto(string email, string role)
        {
            Role = RoleUtils.FromString(role);
            if (RoleUtils.IsBackoffice(Role))
            {
                if (!email.EndsWith("@backoffice.com"))
                {
                    throw new BusinessRuleValidationException("Backoffice users must have an email ending with @backoffice.com");
                }
            }
            Email = new Email(email);
        }
    }
}