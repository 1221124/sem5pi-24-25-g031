import { Repo } from "../../core/infra/Repo";
import { PatientMedicalRecord } from "../../domain/patient-medical-record/PatientMedicalRecord";
import { MedicalRecordNumber } from "../../domain/patient-medical-record/MedicalRecordNumber";

export default interface IPatientMedicalRecordRepo extends Repo<PatientMedicalRecord> {
  /**
   * Saves a patient medical record to the repository.
   * @param patientMedicalRecord - The patient medical record to save.
   * @returns The saved patient medical record.
   */
  save(patientMedicalRecord: PatientMedicalRecord): Promise<PatientMedicalRecord>;

  /**
   * Finds a patient medical record by its domain ID.
   * @param id - The unique identifier of the patient medical record.
   * @returns The found patient medical record, or null if not found.
   */
  findByDomainId(id: string): Promise<PatientMedicalRecord | null>;


  /** */
  findByMedicalRecordNumber(number: MedicalRecordNumber): Promise<PatientMedicalRecord> | null;

  /**
   * Retrieves all medical conditions from the repository.
   * @returns A list of all medical conditions.
   */
  findAll(): Promise<PatientMedicalRecord[]>;

  /**
   * Deletes a patient medical record by its ID.
   * @param patientMedicalRecord - The patient medical record to delete.
   * @returns A promise indicating that the patient medical record has been deleted.
   */
  delete(patientMedicalRecord: PatientMedicalRecord): Promise<void>;
}
