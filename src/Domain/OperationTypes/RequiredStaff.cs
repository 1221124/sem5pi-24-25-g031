using System;
using System.Collections.Generic;
using Domain.Shared;

namespace Domain.OperationTypes
{
    public class RequiredStaff : IValueObject
    {
        public Role Role { get; set; }
        public Specialization Specialization { get; set; }
        public Quantity Quantity { get; set; }

        public RequiredStaff(Role role, Specialization specialization, Quantity quantity)
        {
            Role = role;
            Specialization = specialization;
            Quantity = quantity;
        }

        public static implicit operator RequiredStaff(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Invalid input string for RequiredStaff.");
            }

            var parts = value.Split(',');

            if (parts.Length != 3)
            {
                throw new ArgumentException("Input string must be in the format 'Role,Specialization,Quantity'.");
            }

            // if (!Enum.TryParse(parts[0], out Role role))
            // {
            //     throw new ArgumentException("Invalid Role value.");
            // }

            // if (!Enum.TryParse(parts[1], out Specialization specialization))
            // {
            //     throw new ArgumentException("Invalid Specialization value.");
            // }

            // if (!int.TryParse(parts[2], out int quantityValue))
            // {
            //     throw new ArgumentException("Invalid Quantity value.");
            // }

            var role = RoleUtils.FromString(parts[0]);
            var specialization = SpecializationUtils.FromString(parts[1]);
            var quantity = new Quantity(int.Parse(parts[2]));

            return new RequiredStaff(role, specialization, quantity);
        }

        public static List<RequiredStaff> FromString(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Invalid input string for RequiredStaff.");
            }

            var staffList = new List<RequiredStaff>();

            var staffParts = value.Split(';');

            foreach (var staff in staffParts)
            {
                staffList.Add(staff);
            }

            return staffList;
        }
    }
}
