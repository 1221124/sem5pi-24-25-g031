import { Result } from "../../core/logic/Result";
import { PatientMedicalRecordDto } from "../../dto/patient-medical-record/PatientMedicalRecordDto";

export default interface IFileService  {
    createFile(patientMedicalRecord: PatientMedicalRecordDto): Promise<Result<string>>;
}