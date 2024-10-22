using System;

namespace Domain.Shared

{
    public class PasswordGenerator
    {
        public static string GeneratePassword(string email)
        {
            
            return email.Substring(0, 4) + new Random().Next(0, 9) + "!" + email.Substring(email.Length - 4);
        }
    }
}