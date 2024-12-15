export interface SurgeryRoom {
    Id: number;
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