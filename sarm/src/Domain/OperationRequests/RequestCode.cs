using Domain.Shared;

namespace DDDNetCore.Domain.OperationRequests
{
    public class RequestCode : IValueObject
    {
        public string Value { get; }

        public RequestCode()
        {
        }

        public RequestCode(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Request code cannot be empty");

            if (!value.ToLower().StartsWith("req"))
                throw new ArgumentException("Request code must start with 'req'");

            Value = value;
        }

        public static implicit operator string(RequestCode requestCode)
        {
            return requestCode.Value;
        }

        public static implicit operator RequestCode(string value)
        {
            return new RequestCode(value);
        }

        public override string ToString()
        {
            return Value;
        }

        public override bool Equals(object obj)
        {
            if (obj is RequestCode other)
            {
                return this.Value == other.Value;
            }
            return false;
        }
    }
}