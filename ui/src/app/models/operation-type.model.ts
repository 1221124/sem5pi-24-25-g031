export interface OperationType {
  Id: string;
  OperationTypeCode: string;
  Name: string;
  Specialization: string;
  RequiredStaff: {
    Role: string;
    Specialization: string;
    Quantity: number;
    IsRequiredInPreparation: boolean;
    IsRequiredInSurgery: boolean;
    IsRequiredInCleaning: boolean;
  }[];
  PhasesDuration: {
    Preparation: number;
    Surgery: number;
    Cleaning: number;
  };
  Status: string;
  Version: number;
}
  