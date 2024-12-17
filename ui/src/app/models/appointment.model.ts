export interface Appointment {
    Id: string;
    RequestCode: string;
    SurgeryRoomNumber: string;
    AppointmentNumber: string;
    AppointmentDate: {
        Start: string;
        End: string;
    };
    AssignedStaff: string[];
}