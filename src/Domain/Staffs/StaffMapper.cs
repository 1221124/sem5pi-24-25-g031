using Domain.Shared;
using Domain.Users;

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
                Specialization = staff.Specialization,
                ContactInformation = staff.ContactInformation,
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
                dto.Status
            );
        }

        public static Staff ToEntityFromCreating(CreatingStaffDto dto)
        {
            return new Staff(
                dto.FullName,
                dto.ContactInformation,
                dto.Specialization,
                dto.Status
            );
        }
    }
}