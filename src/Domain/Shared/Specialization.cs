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
            return specialization switch
            {
                "Anaesthesiology" => Specialization.ANAESTHESIOLOGY,
                "Cardiology" => Specialization.CARDIOLOGY,
                "Orthopaedics" => Specialization.ORTHOPAEDICS,
                _ => throw new System.ArgumentException($"Invalid specialization: {specialization}")
            };
        }

        public static string ToString(Specialization specialization)
        {
            return specialization switch
            {
                Specialization.ANAESTHESIOLOGY => "Anaesthesiology",
                Specialization.CARDIOLOGY => "Cardiology",
                Specialization.ORTHOPAEDICS => "Orthopaedics",
                _ => throw new System.ArgumentException($"Invalid specialization: {specialization}")
            };
        }
    }
}