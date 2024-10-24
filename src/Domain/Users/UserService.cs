using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;
using FirebaseAdmin.Auth;

namespace Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;

        public UserService(IUnitOfWork unitOfWork, IUserRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        // public async Task<bool> IsAuthorized(Email email, List<Role> roles)
        // {
        //     // var email = await GetEmailFromToken();
        //     var loggedUser = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email.Value);
        //     var user = _repo.GetByEmailAsync(loggedUser.Email).Result;
            
        //     if (user == null)
        //         return false;

        //     for (int i = 0; i < roles.Count; i++)
        //     {
        //         if (user.Role == roles[i])
        //             return true;
        //     }

        //     return false;
        // }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<UserDto> listDto = UserMapper.ToDtoList(list);

            return listDto;
        }

        public async Task<UserDto> GetByIdAsync(UserId id)
        {
            var User = await this._repo.GetByIdAsync(id);
            
            if(User == null)
                return null;

            return UserMapper.ToDto(User);
        }

        public async Task<UserDto> GetByEmailAsync(Email email)
        {
            var User = await this._repo.GetByEmailAsync(email);

            if(User == null)
                return null;

            return UserMapper.ToDto(User);
        }

        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            var User = UserMapper.ToEntityFromCreating(dto);

            await this._repo.AddAsync(User);

            await this._unitOfWork.CommitAsync();

            return UserMapper.ToDto(User);
        }

        public async Task<UserDto> UpdateAsync(UserDto dto)
        {
            var User = await this._repo.GetByIdAsync(new UserId(dto.Id));

            if (User == null)
                return null;   

            User.Email = dto.Email;
            User.Role = dto.Role;

            await this._unitOfWork.CommitAsync();

            return UserMapper.ToDto(User);
        }   

        public async Task<UserDto> InactivateAsync(UserId id)
        {
            var User = await this._repo.GetByIdAsync(id); 

            if (User == null)
                return null;   

            User.UserStatus = UserStatus.Inactive;
            
            await this._unitOfWork.CommitAsync();

            return UserMapper.ToDto(User);
        }

         public async Task<UserDto> DeleteAsync(UserId id)
        {
            var User = await this._repo.GetByIdAsync(id); 

            if (User == null)
                return null;

            if (User.UserStatus == UserStatus.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active user.");
            
            this._repo.Remove(User);
            await this._unitOfWork.CommitAsync();

            return UserMapper.ToDto(User);
        }
    }
}