// src/app/models/operation-request.model.ts

export interface OperationRequest {
    id: string;
    staff: string;
    patient: string;
    operationType: string;
    deadlineDate: Date;
    priority: number; // 0 = Elective, 1 = Urgent, 2 = Emergency
    status: number;   // 0 = Pending, 1 = Accepted, 2 = Rejected
  }
  