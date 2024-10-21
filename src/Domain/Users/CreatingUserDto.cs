using Domain.Shared;

namespace Domain.Users

{
    public class CreatingUserDto
    {
        public Email Email { get; set; }
        public Role Role { get; set; }

        public CreatingUserDto(string email, string role)
        {
            Email = email;
            Role = RoleUtils.FromString(role);
        }
    }
}