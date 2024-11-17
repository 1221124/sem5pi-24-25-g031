// src/app/models/staff.model.ts

export interface Staff {
  FullName: {
    FirstName: string;
    LastName: string;
  };
  licenseNumber: string;
  specialization: string;
  ContactInformation: {
    Email: string;
    PhoneNumber: string;
  };
  status: string;
  SlotAppointement: {
    Start: string;
    End: string;
  }[];
  SlotAvailability: {
    Start: string;
    End: string;
  }[];
}
