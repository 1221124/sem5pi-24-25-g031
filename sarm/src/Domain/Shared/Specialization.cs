namespace Domain.Shared
{
    public enum Specialization
    {
        ANAESTHESIOLOGY = 0,
        CARDIOLOGY = 1,
        CIRCULATING = 2,
        INSTRUMENTAL = 3,
        MEDICAL_ACTION = 4,
        ORTHOPAEDICS = 5,
        X_RAY = 6
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
                case "CIRCULATING":
                    return Specialization.CIRCULATING;
                case "INSTRUMENTAL":
                    return Specialization.INSTRUMENTAL;
                case "MEDICAL_ACTION":
                    return Specialization.MEDICAL_ACTION;
                case "ORTHOPAEDICS":
                    return Specialization.ORTHOPAEDICS;
                case "X_RAY":
                    return Specialization.X_RAY;
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
                Specialization.CIRCULATING => "CIRCULATING",
                Specialization.INSTRUMENTAL => "INSTRUMENTAL",
                Specialization.MEDICAL_ACTION => "MEDICAL_ACTION",
                Specialization.ORTHOPAEDICS => "ORTHOPAEDICS",
                Specialization.X_RAY => "X_RAY",
                _ => throw new System.ArgumentException($"Invalid specialization: {specialization}")
            };
        }

        public static bool IsCardiologyOrOrthopaedics(Specialization specialization)
        {
            return specialization == Specialization.CARDIOLOGY || specialization == Specialization.ORTHOPAEDICS;
        }
    }
}