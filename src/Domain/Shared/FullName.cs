namespace Domain.Shared
{
    public class FullName : IValueObject
    {
        public string FirstName { get; }
        public string LastName { get; }

        public FullName(string firstName, string lastName)
        {
            FirstName = firstName;
            LastName = lastName;
        }

        public static implicit operator FullName(string value)
        {
            var names = value.Split(' ');
            return new FullName(names[0], names[1]);
        }

        public static implicit operator string(FullName fullName)
        {
            return $"{fullName.FirstName} {fullName.LastName}";
        }
    }
}