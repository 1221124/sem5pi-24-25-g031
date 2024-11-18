// src/app/models/patient.model.ts

export interface Patient {
  Id: string,
  FullName: {
    FirstName: string,
    LastName: string
  },
  DateOfBirth: string,
  Gender: string,
  MedicalRecordNumber: string,
  ContactInformation: {
    Email: string,
    PhoneNumber: number
  },
  MedicalCondition: string[];
  EmergencyContact: number;
  AppointmentHistory: {
    Start: string,
    End: string
  }[],
  UserId: string;
}
