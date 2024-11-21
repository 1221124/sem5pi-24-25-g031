using Newtonsoft.Json;

namespace Domain.Shared
{
    [JsonConverter(typeof(SpecializationConverter ))]
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
                case "INSTRUMENTING":
                    return Specialization.INSTRUMENTAL;
                case "MEDICAL ACTION":
                    return Specialization.MEDICAL_ACTION;
                case "ORTHOPAEDICS":
                    return Specialization.ORTHOPAEDICS;
                case "X-RAY":
                    return Specialization.X_RAY;
                default:
                    throw new ArgumentException($"Invalid specialization: {specialization}");
            }
        }

        public static string ToString(Specialization specialization)
        {
            return specialization switch
            {
                Specialization.ANAESTHESIOLOGY => "Anaesthesiology",
                Specialization.CARDIOLOGY => "Cardiology",
                Specialization.CIRCULATING => "Circulating",
                Specialization.INSTRUMENTAL => "Instrumenting",
                Specialization.MEDICAL_ACTION => "Medical Action",
                Specialization.ORTHOPAEDICS => "Orthopaedics",
                Specialization.X_RAY => "X-Ray",
                _ => throw new ArgumentException($"Invalid specialization: {specialization}")
            };
        }

        public static bool IsCardiologyOrOrthopaedics(Specialization specialization)
        {
            return specialization == Specialization.CARDIOLOGY || specialization == Specialization.ORTHOPAEDICS;
        }
    }
}