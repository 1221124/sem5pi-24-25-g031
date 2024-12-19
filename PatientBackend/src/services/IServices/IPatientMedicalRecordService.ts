import { Result } from "../../core/logic/Result";
import { MedicalRecordEntry } from "../../domain/medical-record-entry/MedicalRecordEntry";
import { CreatingPatientMedicalRecordDto } from "../../dto/patient-medical-record/CreatingPatientMedicalRecordDto";
import { PatientMedicalRecordDto } from "../../dto/patient-medical-record/PatientMedicalRecordDto";
import { UpdatingPatientMedicalRecordDto } from "../../dto/patient-medical-record/UpdatingPatientMedicalRecordDto";

export default interface IPatientMedicalRecordService  {
    getAll(): Promise<Result<PatientMedicalRecordDto[]>>;
    getById(id: string): Promise<Result<PatientMedicalRecordDto>>;
    create(creatingPatientMedicalRecord: CreatingPatientMedicalRecordDto): Promise<Result<PatientMedicalRecordDto>>;
    update(id: string, updatingPatientMedicalRecord: UpdatingPatientMedicalRecordDto): Promise<Result<PatientMedicalRecordDto>>;
    addOrUpdateMedicalConditionEntry(id: string, medicalCondition: MedicalRecordEntry): Promise<Result<PatientMedicalRecordDto>>;
    addOrUpdateAllergyEntry(id: string, allergy: MedicalRecordEntry): Promise<Result<PatientMedicalRecordDto>>;
    delete(id: string): Promise<Result<void>>;
}
