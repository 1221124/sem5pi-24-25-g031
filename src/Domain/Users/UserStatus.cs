namespace Domain.Users

{
    public enum UserStatus
    {
        Active,
        Inactive,
        Pending,
        Blocked
    }

    public class UserStatusUtils
    {
        public static UserStatus FromString(string status)
        {
            switch (status)
            {
                case "Active":
                    return UserStatus.Active;
                case "Inactive":
                    return UserStatus.Inactive;
                case "Pending":
                    return UserStatus.Pending;
                case "Blocked":
                    return UserStatus.Blocked;
                default:
                    throw new System.ArgumentException("Invalid UserStatus value", status);
            }
        }

        public static string ToString(UserStatus status)
        {
            switch (status)
            {
                case UserStatus.Active:
                    return "Active";
                case UserStatus.Inactive:
                    return "Inactive";
                case UserStatus.Pending:
                    return "Pending";
                case UserStatus.Blocked:
                    return "Blocked";
                default:
                    throw new System.ArgumentException("Invalid UserStatus value", status.ToString());
            }
        }
    }
}