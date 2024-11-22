// src/app/models/operation-requests/operation-request.model.ts

export interface OperationRequest {
    id: string;
    staff: string;
    patient: string;
    operationType: string;
    deadlineDate: string;
    priority: string; // 0 = Elective, 1 = Urgent, 2 = Emergency
    status: string;   // 0 = Pending, 1 = Accepted, 2 = Rejected
    requestCode: string;
  }
