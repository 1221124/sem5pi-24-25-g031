using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class PhasesDuration : IValueObject
    {
        public Dictionary<Phase, Quantity> Phases { get; set; }

        public PhasesDuration(Dictionary<Phase, Quantity> phases)
        {
            if (!phases.ContainsKey(Phase.Preparation) || !phases.ContainsKey(Phase.Surgery) || !phases.ContainsKey(Phase.Cleaning))
            {
                throw new BusinessRuleValidationException("Operation type must contain all three phases (anesthesia, surgery, and cleaning).");
            }
            Phases = phases;
        }

        public PhasesDuration()
        {
            Phases = new Dictionary<Phase, Quantity>
            {
                { Phase.Preparation, new Quantity(0) },
                { Phase.Surgery, new Quantity(0) },
                { Phase.Cleaning, new Quantity(0) }
            };
        }

        public static implicit operator PhasesDuration(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Invalid input string for PhasesDuration.");
            }

            var phasesDictionary = new Dictionary<Phase, Quantity>();

            var phasePairs = value.Split(',');

            foreach (var pair in phasePairs)
            {
                var keyValue = pair.Split(':');
                if (keyValue.Length != 2)
                {
                    throw new ArgumentException("Input string must be in the format 'Phase:Quantity'.");
                }

                // if (!Enum.TryParse(keyValue[0], out Phase phase))
                // {
                //     throw new ArgumentException($"Invalid Phase value: {keyValue[0]}.");
                // }

                // if (!int.TryParse(keyValue[1], out int quantityValue))
                // {
                //     throw new ArgumentException($"Invalid Quantity value for phase {keyValue[0]}.");
                // }

                var phase = PhaseUtils.FromString(keyValue[0]);
                var quantityValue = new Quantity(int.Parse(keyValue[1]));

                phasesDictionary[phase] = quantityValue;
            }

            if (!phasesDictionary.ContainsKey(Phase.Preparation) || 
                !phasesDictionary.ContainsKey(Phase.Surgery) || 
                !phasesDictionary.ContainsKey(Phase.Cleaning))
            {
                throw new BusinessRuleValidationException("Operation type must contain all three phases (anesthesia, surgery, and cleaning).");
            }

            return new PhasesDuration(phasesDictionary);
        }

        public static implicit operator string(PhasesDuration value)
        {
            if (value == null || !value.Phases.ContainsKey(Phase.Preparation) || !value.Phases.ContainsKey(Phase.Surgery) || !value.Phases.ContainsKey(Phase.Cleaning))
            {
                throw new InvalidOperationException("PhasesDuration is not properly initialized.");
            }

            var phaseStrings = new List<string>();

            foreach (var entry in value.Phases)
            {
                var phaseString = $"{PhaseUtils.ToString(entry.Key)}:{entry.Value.Value}";
                phaseStrings.Add(phaseString);
            }

            return string.Join(",", phaseStrings);
        }

        public static PhasesDuration FromString(List<string> phasesDuration)
        {
            if (phasesDuration.Count != 3)
            {
                throw new BusinessRuleValidationException("Operation type must contain all three phases (anesthesia, surgery, and cleaning).");
            }

            var phasesDictionary = new Dictionary<Phase, Quantity> { };

            foreach (var phase in phasesDuration)
            {
                var str = phase.Split(':');
                var str0 = str[0].ToUpper();
                if (str0 != "PREPARATION" && str0 != "SURGERY" && str0 != "CLEANING")
                {
                    throw new BusinessRuleValidationException("Operation type must contain all three phases (anesthesia, surgery, and cleaning).");
                }
                var str1 = int.Parse(str[1]);
                phasesDictionary.Add(PhaseUtils.FromString(str[0]), new Quantity(str1));
            }

            return new PhasesDuration(phasesDictionary);
        }
    }

    public enum Phase
    {
        Preparation = 0,
        Surgery = 1,
        Cleaning = 2
    }

    public class PhaseUtils
    {
        public static Phase FromString(string phase)
        {
            switch (phase.ToUpper())
            {
                case "PREPARATION":
                    return Phase.Preparation;
                case "SURGERY":
                    return Phase.Surgery;
                case "CLEANING":
                    return Phase.Cleaning;
                default:
                    throw new ArgumentException("Invalid Phase value", phase);
            }
        }

        public static string ToString(Phase phase)
        {
            switch (phase)
            {
                case Phase.Preparation:
                    return "PREPARATION";
                case Phase.Surgery:
                    return "SURGERY";
                case Phase.Cleaning:
                    return "CLEANING";
                default:
                    throw new ArgumentException("Invalid Phase value", phase.ToString());
            }
        }

        public static PhasesDuration FromStringList(List<string> phasesDuration)
        {
            if (phasesDuration.Count != 3)
            {
                throw new BusinessRuleValidationException("Operation type must contain all three phases (preparation, surgery, and cleaning).");
            }
            
            var phasesDictionary = new Dictionary<Phase, Quantity>{};

            foreach (var phase in phasesDuration)
            {
                var str = phase.Split(':');
                phasesDictionary.Add(PhaseUtils.FromString(str[0]), new Quantity(int.Parse(str[1])));
            }

            return new PhasesDuration(phasesDictionary);
        }
    }
}
