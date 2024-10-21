using System;
using Domain.Shared;

namespace Domain.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public Email Email { get; set; }
        public Role Role { get; set; }
        public UserStatus UserStatus { get; set; }
    }
}