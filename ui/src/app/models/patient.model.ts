// src/app/models/patient.model.ts

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
  MedicalCondition: string[];
  EmergencyContact: number;
  AppointmentHistory: {
    Start: Date,
    End: Date
  }[],
  UserId: string;
}
