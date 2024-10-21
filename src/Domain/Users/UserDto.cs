using System;

namespace Domain.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string UserStatus { get; set; }
    }
}