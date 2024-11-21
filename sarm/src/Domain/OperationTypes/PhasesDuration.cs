using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class PhasesDuration : IValueObject
    {
        public Quantity Preparation;
        public Quantity Surgery;
        public Quantity Cleaning;

        public PhasesDuration(Quantity preparation, Quantity surgery, Quantity cleaning)
        {
            if (preparation == null || surgery == null || cleaning == null)
            {
                throw new BusinessRuleValidationException("Operation type must contain all three phases (anesthesia, surgery, and cleaning).");
            }
            Preparation = preparation;
            Surgery = surgery;
            Cleaning = cleaning;
        }

        public PhasesDuration(int preparation, int surgery, int cleaning)
        {
            Preparation = preparation;
            Surgery = surgery;
            Cleaning = cleaning;
        }

        public PhasesDuration()
        {
            Preparation = 0;
            Surgery = 0;
            Cleaning = 0;
        }

        public static implicit operator PhasesDuration(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Invalid input string for PhasesDuration.");
            }

            var parts = value.Split(',');

            if (parts.Length != 3)
            {
                throw new ArgumentException("Input string must be in the format 'PREPARATION:int,SURGERY:int,CLEANING:int'.");
            }

            string preparationString = parts[0].Split(':')[1];
            if (!int.TryParse(preparationString, out int preparationValue) || preparationValue < 0)
            {
                throw new ArgumentException($"Invalid Preparation value: {preparationString}.");
            }

            string surgeryString = parts[1].Split(':')[1];
            if (!int.TryParse(surgeryString, out int surgeryValue) || surgeryValue < 0)
            {
                throw new ArgumentException($"Invalid Surgery value: {surgeryString}.");
            }

            string cleaningString = parts[2].Split(':')[1];
            if (!int.TryParse(cleaningString, out int cleaningValue) || cleaningValue < 0)
            {
                throw new ArgumentException($"Invalid Cleaning value: {cleaningString}.");
            }

            return new PhasesDuration(preparationValue, surgeryValue, cleaningValue);
        }

        public static implicit operator string(PhasesDuration value)
        {
            if (value == null)
            {
                return string.Empty;
            }

            return $"PREPARATION:{value.Preparation.Value},SURGERY:{value.Surgery.Value},CLEANING:{value.Cleaning.Value}";
        }

        public static PhasesDuration FromString(List<string> phasesDuration)
        {
            if (phasesDuration.Count != 3)
            {
                throw new BusinessRuleValidationException("Operation type must contain all three phases (anesthesia, surgery, and cleaning).");
            }

            var preparation = int.Parse(phasesDuration[0].Split(':')[1]);
            var surgery = int.Parse(phasesDuration[1].Split(':')[1]);
            var cleaning = int.Parse(phasesDuration[2].Split(':')[1]);

            return new PhasesDuration(preparation, surgery, cleaning);
        }
    }
}
