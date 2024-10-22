using System;
using Domain.Shared;

namespace Domain.Users
{
    public class User : Entity<UserId>, IAggregateRoot
    {
        public Username Username { get; set; }
        public Email Email { get; set; }
        public Role Role { get; set; }
        public UserStatus UserStatus { get; set; }

        public User() { }
        
        public User(Email email, Role role)
        {
            Id = new UserId(Guid.NewGuid());
            Username = email.Value;
            Email = email;
            Role = role;
            UserStatus = UserStatus.Pending;
        }

        public User(string email, string role)
        {
            Id = new UserId(Guid.NewGuid());
            Username = email;
            Email = email;
            Role = RoleUtils.FromString(role);
            UserStatus = UserStatus.Pending;
        }
    }
}