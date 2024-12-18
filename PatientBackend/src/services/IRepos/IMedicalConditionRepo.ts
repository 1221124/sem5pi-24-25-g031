import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/medical-condition/MedicalCondition";
import { ICD11Code } from "../../domain/shared/ICD11Code";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
  /**
   * Saves a medical condition to the repository.
   * @param medicalCondition - The medical condition to save.
   * @returns The saved medical condition.
   */
  save(medicalCondition: MedicalCondition): Promise<MedicalCondition>;

  /**
   * Finds a medical condition by its domain ID.
   * @param id - The unique identifier of the medical condition.
   * @returns The found medical condition, or null if not found.
   */
  findByDomainId(id: string): Promise<MedicalCondition | null>;


  /** */
  findByCode(code: ICD11Code): Promise<MedicalCondition> | null;

  /**
   * Retrieves all medical conditions from the repository.
   * @returns A list of all medical conditions.
   */
  findAll(): Promise<MedicalCondition[]>;

  /**
   * Deletes a medical condition by its ID.
   * @param medicalCondition - The medical condition to delete.
   * @returns A promise indicating that the medical condition has been deleted.
   */
  delete(medicalCondition: MedicalCondition): Promise<void>;
}
