using Domain.Shared;

namespace Domain.Users

{
    public class CreatingUserDto
    {
        public Email Email { get; set; }
        public Role Role { get; set; }

        public CreatingUserDto(Email email, Role role)
        {
            Role = role;
            Email = email;
        }
    }
}