export interface OperationType {
  Id: string;
  Name: string;
  Specialization: string;
  RequiredStaff: {
    Role: string;
    Specialization: string;
    Quantity: number;
  }[];
  PhasesDuration: {
    Preparation: number;
    Surgery: number;
    Cleaning: number;
  };
  Status: string;
}
  