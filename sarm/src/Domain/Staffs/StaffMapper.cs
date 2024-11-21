using Domain.Shared;
using Domain.Users;
using Org.BouncyCastle.Utilities;

namespace Domain.Staffs
{
    public class StaffMapper
    {
        public static StaffDto ToDto(Staff staff)
        {
            return new StaffDto
            {
                Id = staff.Id.AsGuid(),
                UserId = staff.UserId,
                FullName = staff.FullName,
                LicenseNumber = staff.LicenseNumber,
                Specialization = staff.Specialization,
                ContactInformation = staff.ContactInformation,
                StaffRole = staff.StaffRole,
                Status = staff.Status,
                SlotAppointement = staff.SlotAppointement,
                SlotAvailability = staff.SlotAvailability
            };
        }

        public static Staff ToEntity(StaffDto dto)
        {
            return new Staff(
                new StaffId(dto.Id),
                dto.UserId,
                dto.FullName,
                dto.ContactInformation,
                dto.Specialization,
                dto.StaffRole,
                dto.Status
            );
        }

        public static Staff ToEntityFromCreating(CreatingStaffDto dto)
        {
            
            return new Staff(
                dto.FullName,
                new ContactInformation(dto.Email, dto.PhoneNumber),
                dto.Specialization,
                dto.StaffRole
            );
        }

        public static UpdatingStaffDto ToEntityFromUpdating(StaffDto dto)
        {
            return new UpdatingStaffDto(
                dto.ContactInformation.Email,
                dto.ContactInformation.PhoneNumber,
                dto.SlotAvailability,
                dto.Specialization
            );
        }

        public static List<StaffDto> ToDtoList(List<Staff> staffs)
        {
            if (staffs == null)
            {
                return null;
            }else if (staffs.Count == 0)
            {
                return new List<StaffDto>();
            }
            else
            {
                return staffs.ConvertAll(staff => ToDto(staff));
            }
        }

        public static List<Staff> ToEntityList(List<StaffDto> dtoList)
        {
            if (dtoList == null)
            {
                return null;
            }else if (dtoList.Count == 0)
            {
                return new List<Staff>();
            }
            else
            {
                return dtoList.ConvertAll(dto => ToEntity(dto));
            }
        }
    }
}