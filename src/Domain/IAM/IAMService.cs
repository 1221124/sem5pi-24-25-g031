using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;
using Google.Cloud.Firestore;
using System;
using Infrastructure;
using FirebaseAdmin.Auth;
using Domain.Users;

namespace Domain.IAM
{
    public class IAMService
    {
        // private readonly SARMDbContext _dbContext;
        
        // private FirestoreDb _firestoreDb;

        // public IAMService()
        // {
        //     string pathToServiceAccountKey = "../../../sem5-pi-24-25-g061-firebase-adminsdk-wo55l-834164845b.json";
        //     Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", pathToServiceAccountKey);
            
        //     _firestoreDb = FirestoreDb.Create("sem5-pi-24-25-g061"); //TODO: Review this
        // }

        // public IAMService(SARMDbContext dbContext)
        // {
        //     // _dbContext = dbContext;
        // }

        public async Task<Email> GetEmailFromToken(string token)
        {
            try
            {
                var decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
                return new Email(decodedToken.Claims["email"]?.ToString());
            }
            catch (FirebaseAuthException ex)
            {
                throw new Exception("Invalid token.", ex);
            }
        }
        
        public async Task<UserDto> RegisterUser(CreatingUserDto dto)
        {
            var userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(new UserRecordArgs()
            {
                Email = dto.Email,
                EmailVerified = false,
                Password = PasswordGenerator.GeneratePassword(dto.Email),
                DisplayName = dto.Email,
                Disabled = false
            });

            var user = new User(userRecord.Email, dto.Role);

            return UserMapper.ToDto(user);
        }
    }
}