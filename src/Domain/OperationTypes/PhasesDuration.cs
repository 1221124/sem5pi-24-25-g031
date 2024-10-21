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
    }

    public enum Phase
    {
        Preparation,
        Surgery,
        Cleaning
    }

    public class PhaseUtils
    {
        public static Phase FromString(string phase)
        {
            switch (phase)
            {
                case "Preparation":
                    return Phase.Preparation;
                case "Surgery":
                    return Phase.Surgery;
                case "Cleaning":
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
                    return "Preparation";
                case Phase.Surgery:
                    return "Surgery";
                case Phase.Cleaning:
                    return "Cleaning";
                default:
                    throw new ArgumentException("Invalid Phase value", phase.ToString());
            }
        }
    }
}
