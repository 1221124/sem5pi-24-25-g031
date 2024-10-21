using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Shared;

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

        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            var User = new User(dto.Email, dto.Role);

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

            User.UserStatus = UserStatus.Blocked;
            
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