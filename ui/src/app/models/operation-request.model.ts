// src/app/models/operation-request.model.ts

export interface OperationRequest {
    id: string; // assuming this is a GUID
    doctorId: string | { id: string }; // string or object with 'id' property
    patientId: string | { id: string };
    operationTypeId: string | { id: string };
    deadlineDate: string | { date: string }; // string or object with 'date' property
    priority: number; // 0 = Elective, 1 = Urgent, 2 = Emergency
    status: number;   // 0 = Pending, 1 = Accepted, 2 = Rejected
  }
  