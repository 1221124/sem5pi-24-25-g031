using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.Domain.Appointments;

public class AppointmentDto
{
    public Guid Id { get; set; }
    public RequestCode RequestCode { get; set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
    public AppointmentNumber AppointmentNumber { get; set; }
    public Slot AppointmentDate { get; set; }
    public List<LicenseNumber> AssignedStaff { get; set; }

    public AppointmentDto()
    {
    }

    public AppointmentDto(Guid id, RequestCode requestCode, SurgeryRoomNumber surgeryRoomNumber, AppointmentNumber appointmentNumber, Slot appointmentDate, List<LicenseNumber> assignedStaff)
    {
        Id = id;
        RequestCode = requestCode;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentNumber = appointmentNumber;
        AppointmentDate = appointmentDate;
        AssignedStaff = assignedStaff;
    }
}