// src/app/models/operation-requests/operation-request.model.ts

export interface OperationRequest {
    id: string;
    staff: string;
    patient: string;
    operationType: string;
    deadlineDate: string;
    priority: string;
    status: string;
    requestCode: string;
  }
