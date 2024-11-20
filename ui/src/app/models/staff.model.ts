// src/app/models/staff.model.ts

export interface Staff {
  Id: string,
  FullName: {
    FirstName: string;
    LastName: string;
  };
  licenseNumber: string;
  specialization: string;
  staffRole: string;
  ContactInformation: {
    Email: string;
    PhoneNumber: string;
  };
  status: string;
  SlotAppointment: {
    Start: string;
    End: string;
  }[];
  SlotAvailability: {
    Start: string;
    End: string;
  }[];
}
