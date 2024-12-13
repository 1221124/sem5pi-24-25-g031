// src/app/models/patient-main.model.ts

export interface Patient {
  Id: string,
  FullName: {
    FirstName: string,
    LastName: string
  },
  DateOfBirth: Date,
  Gender: string,
  MedicalRecordNumber: string,
  ContactInformation: {
    Email: string,
    PhoneNumber: number
  },
  EmergencyContact: number;
  UserId: string;
}
