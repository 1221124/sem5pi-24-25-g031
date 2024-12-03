using Domain.Shared;

namespace Domain.OperationTypes
{
    public class RequiredStaff : IValueObject
    {
        public Role Role { get; set; }
        public Specialization Specialization { get; set; }
        public Quantity Quantity { get; set; }
        public bool IsRequiredInPreparation { get; set; }
        public bool IsRequiredInSurgery { get; set; }
        public bool IsRequiredInCleaning { get; set; }

        public RequiredStaff(Role role, Specialization specialization, Quantity quantity, bool isRequiredInPreparation, bool isRequiredInSurgery, bool isRequiredInCleaning)
        {
            Role = role;
            Specialization = specialization;
            Quantity = quantity;
            IsRequiredInPreparation = isRequiredInPreparation;
            IsRequiredInSurgery = isRequiredInSurgery;
            IsRequiredInCleaning = isRequiredInCleaning;
        }

        public static implicit operator RequiredStaff(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Invalid input string for RequiredStaff.");
            }

            var parts = value.Split(',');

            if (parts.Length != 6)
            {
                throw new ArgumentException("Input string must be in the format 'Role,Specialization,Quantity,IsRequiredInPreparation,IsRequiredInSurgery,IsRequiredInCleaning'.");
            }

            var role = RoleUtils.FromString(parts[0]);
            var specialization = SpecializationUtils.FromString(parts[1]);
            if (!int.TryParse(parts[2], out int quantityValue) || quantityValue < 0)
            {
                throw new ArgumentException($"Invalid Quantity value: {parts[2]}.");
            }

            var quantity = new Quantity(quantityValue);

            var isRequiredInPreparation = false;
            var isRequiredInSurgery = false;
            var isRequiredInCleaning = false;
            if (parts[3].Trim().ToLower() == "true") isRequiredInPreparation = true;
            if (parts[4].Trim().ToLower() == "true") isRequiredInSurgery = true;
            if (parts[5].Trim().ToLower() == "true") isRequiredInCleaning = true;

            return new RequiredStaff(role, specialization, quantity, isRequiredInPreparation, isRequiredInSurgery, isRequiredInCleaning);
        }

        public static string ToString(List<RequiredStaff> staff)
        {
            if (staff == null || staff.Count == 0)
            {
                return string.Empty;
            }

            var staffStrings = new List<string>();

            foreach (var staffMember in staff)
            {
                var specializationString = SpecializationUtils.ToString(staffMember.Specialization);
                var roleString = RoleUtils.ToString(staffMember.Role);
                var quantityString = staffMember.Quantity.Value.ToString();
                var isRequiredInPreparationString = staffMember.IsRequiredInPreparation.ToString().ToLower();
                var isRequiredInSurgeryString = staffMember.IsRequiredInSurgery.ToString().ToLower();
                var isRequiredInCleaningString = staffMember.IsRequiredInCleaning.ToString().ToLower();
                staffStrings.Add($"{roleString},{specializationString},{quantityString},{isRequiredInPreparationString},{isRequiredInSurgeryString},{isRequiredInCleaningString}");
            }

            return string.Join(";", staffStrings);
        }

        public static List<RequiredStaff> FromString(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Invalid input string for RequiredStaff.");
            }

            var staffStrings = value.Split(';');
            var staffList = new List<RequiredStaff>();

            foreach (var str in staffStrings)
            {
                staffList.Add((RequiredStaff)str);
            }

            return staffList;
        }
    }

    public class RequiredStaffUtils
    {
        public static List<RequiredStaff> FromStringList(List<string> requiredStaff)
        {
            if (requiredStaff == null || requiredStaff.Count == 0)
            {
                throw new ArgumentException("Invalid input list for RequiredStaff.");
            }

            var staffList = new List<RequiredStaff>();

            foreach (var str in requiredStaff)
            {
                staffList.Add((RequiredStaff)str);
            }

            return staffList;
        }
    }
}