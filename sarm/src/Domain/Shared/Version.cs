namespace Domain.Shared
{
    public class Version
    {
        public int Value { get; private set; }

        public Version(int value)
        {
            if (value <= 0)
            {
                throw new ArgumentException("Version value must be a positive integer.");
            }
            Value = value;
        }

        public static implicit operator int(Version version)
        {
            return version.Value;
        }

        public static implicit operator Version(int value)
        {
            return new Version(value);
        }

        public override bool Equals(object obj)
        {
            if (obj is Version other)
            {
                return this.Value == other.Value;
            }
            return false;
        }

        public void Increment()
        {
            Value++;
        }

        public override string ToString()
        {
            return $"v{Value}";
        }
    }
}