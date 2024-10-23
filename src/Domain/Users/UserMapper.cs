using System.Collections.Generic;
using Domain.Shared;

namespace Domain.Users
{
    public class UserMapper
    {
        public static UserDto ToDto(User User)
        {
            return new UserDto
            {
                Id = User.Id.AsGuid(),
                Email = User.Email,
                Role = User.Role,
                UserStatus = User.UserStatus
            };
        }

        public static User ToEntity(UserDto userDto)
        {
            return new User(
                userDto.Email,
                userDto.Role
            );
        }

        public static List<UserDto> ToDtoList(List<User> Users)
        {
            return Users.ConvertAll(user => ToDto(user));
        }

        public static List<User> ToEntityList(List<UserDto> userDtos)
        {
            return userDtos.ConvertAll(userDto => ToEntity(userDto));
        }

        public static User ToEntityFromCreating(CreatingUserDto dto)
        {
            return new User(
                dto.Email,
                dto.Role
            );
        }
    }
}