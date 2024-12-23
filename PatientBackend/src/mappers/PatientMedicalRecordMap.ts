import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { ICD11Code } from "../domain/shared/ICD11Code";
import { PatientMedicalRecordDto } from "../dto/patient-medical-record/PatientMedicalRecordDto";
import { PatientMedicalRecord } from "../domain/patient-medical-record/PatientMedicalRecord";
import { PatientMedicalRecordId } from "../domain/patient-medical-record/PatientMedicalRecordId";
import { MedicalRecordNumber } from "../domain/patient-medical-record/MedicalRecordNumber";
import { MedicalRecordEntry } from "../domain/medical-record-entry/MedicalRecordEntry";

export class PatientMedicalRecordMap {
    public static toDto(patientMedicalRecord: PatientMedicalRecord): PatientMedicalRecordDto {
      return {
        id: patientMedicalRecord.id.toString(),
        medicalRecordNumber: patientMedicalRecord.medicalRecordNumber,
        allergies: patientMedicalRecord.allergies,
        medicalConditions: patientMedicalRecord.medicalConditions
      } as PatientMedicalRecordDto;
    }

    public static toDomain(raw: any): PatientMedicalRecord {
        const patientMedicalRecordIdOrError = PatientMedicalRecordId.create(raw.patientMedicalRecordId);
        if (patientMedicalRecordIdOrError == null) throw new Error("patientMedicalRecordId failed validation.")

        const medicalRecordNumberOrError = MedicalRecordNumber.create(raw.medicalRecordNumber);
        if (medicalRecordNumberOrError.isFailure) throw new Error("Medical Record Number failed validation.");
        const medicalRecordNumber = medicalRecordNumberOrError.getValue();

        const allergiesOrError = raw.allergies.map((allergy: any) => MedicalRecordEntry.create(ICD11Code.create(allergy.split("_")[0]).getValue(), new Date(allergy.split("_")[1])));
        if (allergiesOrError.some((result: any) => result.isFailure)) {
            throw new Error("One or more allergies failed validation.");
        }
        const allergies = allergiesOrError.map((result: any) => result);

        const medicalConditionsOrError = raw.medicalConditions.map((medicalCondition: any) => MedicalRecordEntry.create(ICD11Code.create(medicalCondition.split("_")[0]).getValue(), new Date(medicalCondition.split("_")[1])));
        if (medicalConditionsOrError.some((result: any) => result.isFailure)) {
            throw new Error("One or more medical conditions failed validation.");
        }
        const medicalConditions = medicalConditionsOrError.map((result: any) => result);

        const patientMedicalRecordOrError = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: allergies,
            medicalConditions: medicalConditions
            }, patientMedicalRecordIdOrError);

        if (patientMedicalRecordOrError.isFailure) {
            throw new Error(patientMedicalRecordOrError.error.toString());
        }

        return patientMedicalRecordOrError.getValue();
    }
  
    public static async toDomainfromCreating(raw: any): Promise<PatientMedicalRecord> {
        const medicalRecordNumberOrError = MedicalRecordNumber.create(raw.medicalRecordNumber);
        if (medicalRecordNumberOrError.isFailure) throw new Error("Medical Record Number failed validation.");
        const medicalRecordNumber = medicalRecordNumberOrError.getValue();

        const allergies = new Array<MedicalRecordEntry>();
        const medicalConditions = new Array<MedicalRecordEntry>();

        const patientMedicalRecordOrError = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: allergies,
            medicalConditions: medicalConditions
            }, new UniqueEntityID());

        if (patientMedicalRecordOrError.isFailure) {
            throw new Error(patientMedicalRecordOrError.error.toString());
        }

        return patientMedicalRecordOrError.getValue();
    }

    public static toPersistence(patientMedicalRecord: PatientMedicalRecord): any {
      const a = {
        patientMedicalRecordId: patientMedicalRecord.id.toString(),
        medicalRecordNumber: patientMedicalRecord.medicalRecordNumber.value,
        allergies: patientMedicalRecord.allergies.map((allergy) => allergy.code.toString() + "_" + allergy.date.toISOString() + "_" + allergy.notMeaningfulAnyMore),
        medicalConditions: patientMedicalRecord.medicalConditions.map((medicalCondition) => medicalCondition.code.toString() + "_" + medicalCondition.date.toISOString() + "_" + medicalCondition.notMeaningfulAnyMore)
      }

      return a;
    }

    public static fromPersistence(raw: any){
        const patientMedicalRecordId = PatientMedicalRecordId.create(raw.patientMedicalRecordId);
      
        const medicalRecordNumberOrError = MedicalRecordNumber.create(raw.medicalRecordNumber);
        if (medicalRecordNumberOrError.isFailure) throw new Error("Medical Record Number failed validation.");
        const medicalRecordNumber = medicalRecordNumberOrError.getValue();

        const allergiesOrError = raw.allergies.map((allergy: any) => MedicalRecordEntry.createWithNotMeaningfulAnyMore(ICD11Code.create(allergy.split("_")[0]).getValue(), new Date(allergy.split("_")[1]), allergy.split("_")[2]));
        if (allergiesOrError.some((result: any) => result.isFailure)) {
            throw new Error("One or more allergies failed validation.");
        }
        const allergies = allergiesOrError.map((result: any) => result);

        const medicalConditionsOrError = raw.medicalConditions.map((medicalCondition: any) => MedicalRecordEntry.createWithNotMeaningfulAnyMore(ICD11Code.create(medicalCondition.split("_")[0]).getValue(), new Date(medicalCondition.split("_")[1]), medicalCondition.split("_")[2]));
        if (medicalConditionsOrError.some((result: any) => result.isFailure)) {
            throw new Error("One or more medical conditions failed validation.");
        }
        const medicalConditions = medicalConditionsOrError.map((result: any) => result);

        const a = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: allergies,
            medicalConditions: medicalConditions
        }, patientMedicalRecordId).getValue();

        console.log("Patient medical record from persistence: " + a);
        
        return a;
    }
  }