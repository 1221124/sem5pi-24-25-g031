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
  SlotAvailability: {
    Start: string;
    End: string;
  }[];
}
