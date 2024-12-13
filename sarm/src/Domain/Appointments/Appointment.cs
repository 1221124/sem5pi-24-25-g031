using DDDNetCore.Domain.OperationRequests;
using DDDNetCore.Domain.SurgeryRooms;
using Domain.Shared;
using Domain.Staffs;

namespace DDDNetCore.Domain.Appointments;

public class Appointment : Entity<AppointmentId>, IAggregateRoot
{
    public RequestCode RequestCode { get; set; }
    public SurgeryRoomNumber SurgeryRoomNumber { get; set; }
    public AppointmentNumber AppointmentNumber { get; set; }
    public Slot AppointmentDate { get; set; }
    public List<LicenseNumber> AssignedStaff { get; set; }

    public Appointment()
    {
    }

    public Appointment(RequestCode requestCode, SurgeryRoomNumber surgeryRoomNumber, AppointmentNumber appointmentNumber, Slot appointmentDate, List<LicenseNumber> assignedStaff) 
    {
        Id = new AppointmentId(Guid.NewGuid());
        RequestCode = requestCode;
        SurgeryRoomNumber = surgeryRoomNumber;
        AppointmentNumber = appointmentNumber;
        AppointmentDate = appointmentDate;
        AssignedStaff = assignedStaff;
    }
    
    public void AssignStaff(LicenseNumber staff)
    {
        if (AssignedStaff == null)
        {
            AssignedStaff = new List<LicenseNumber>();
        }
        AssignedStaff.Add(staff);
    }

    public override bool Equals(object? obj)
    {
        if (obj == null || GetType() != obj.GetType())
        {
            return false;
        }

        var other = (Appointment)obj;
        return AppointmentNumber == other.AppointmentNumber;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(AppointmentNumber);
    }

}