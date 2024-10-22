namespace Domain.Shared
{
    public enum Specialization
    {
        ANAESTHESIOLOGY,
        CARDIOLOGY,
        ORTHOPAEDICS
    }
    public class SpecializationUtils
    {
        public static Specialization FromString(string specialization)
        {
            switch (specialization.ToUpper())
            {
                case "ANAESTHESIOLOGY":
                    return Specialization.ANAESTHESIOLOGY;
                case "CARDIOLOGY":
                    return Specialization.CARDIOLOGY;
                case "ORTHOPAEDICS":
                    return Specialization.ORTHOPAEDICS;
                default:
                    throw new System.ArgumentException($"Invalid specialization: {specialization}");
            }
        }

        public static string ToString(Specialization specialization)
        {
            return specialization switch
            {
                Specialization.ANAESTHESIOLOGY => "ANAESTHESIOLOGY",
                Specialization.CARDIOLOGY => "CARDIOLOGY",
                Specialization.ORTHOPAEDICS => "ORTHOPAEDICS",
                _ => throw new System.ArgumentException($"Invalid specialization: {specialization}")
            };
        }
    }
}