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

        public static implicit operator string(FullName fullName)
        {
            return $"{fullName.FirstName} {fullName.LastName}";
        }
    }
}