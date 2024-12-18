export interface SurgeryRoom {
    Id: string;
    SurgeryRoomNumber: string;
    RoomTypeCode: string;
    RoomCapacity: string;
    AssignedEquipment: string;
    CurrentStatus: string;
    MaintenanceSlots: {
        Start: string;
        End: string;
    }[];
}