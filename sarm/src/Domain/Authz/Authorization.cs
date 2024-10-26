using Domain.Users;

namespace Domain.Authz
{
    public class Authorization
    {
        public bool Valid { get; set; }
        public Guid Id { get; set; }
        public Authorization()
        {
            Valid = false;
        }
        public Authorization(Guid id)
        {
            Valid = true;
            Id = id;
        }
    }
}