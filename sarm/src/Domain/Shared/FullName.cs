using Newtonsoft.Json;

namespace Domain.Shared
{
    public class FullName : IValueObject
    {
        public Name FirstName { get; set; }
        public Name LastName { get; set; }

        [JsonConstructor]
        public FullName(Name firstName, Name lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }

        public FullName(string value)
        {
            var names = value.Split(',');
            if (names != null)
                _ = new FullName(names[0], names[1]);
        }
        
        public override string ToString()
        {
            return $"{FirstName.Value} {LastName.Value}";
        }
        
        public static implicit operator string(FullName fullName)
        {
            return $"{fullName.FirstName.Value} {fullName.LastName.Value}";
        }
        
        public override bool Equals(object obj)
        {
            if (obj is FullName other)
            {
                return FirstName.Value.Equals(other.FirstName) && LastName.Value.Equals(other.LastName);
            }
            return false;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(FirstName, LastName);
        }
    }
}