import { Result } from "../../core/logic/Result";
import { MedicalRecordNumber } from "../../domain/patient-medical-record/MedicalRecordNumber";

export class CreatingPatientMedicalRecordDto {
    medicalRecordNumber: MedicalRecordNumber;

    constructor (medicalRecordNumber: MedicalRecordNumber) {
        this.medicalRecordNumber = medicalRecordNumber;
    }

    public static create (value: string): Result<CreatingPatientMedicalRecordDto> {
        const medicalRecordNumber = MedicalRecordNumber.create(value);
        const patientMedicalRecordDto = new CreatingPatientMedicalRecordDto(medicalRecordNumber.getValue());
        return Result.ok<CreatingPatientMedicalRecordDto>(patientMedicalRecordDto);
    }
}