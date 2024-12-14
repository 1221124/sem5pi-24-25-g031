using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.Domain.Appointments;

public class UpdatingAppointmentDto
{
    public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
    public Slot AppointmentDate { get; set; }
    public List<LicenseNumber> AssignedStaff { get; set; }

    public UpdatingAppointmentDto(SurgeryRoomNumber surgeryRoomNumber,Slot appointmentDate, List<LicenseNumber> assignedStaff)
    {
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentDate = appointmentDate;
        AssignedStaff = assignedStaff;
    }
}