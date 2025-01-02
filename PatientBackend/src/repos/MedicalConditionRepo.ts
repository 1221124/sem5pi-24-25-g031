import { Service, Inject } from 'typedi';

import IMedicalConditionRepo from "../services/IRepos/IMedicalConditionRepo";
import { MedicalCondition } from "../domain/medical-condition/MedicalCondition";
import { MedicalConditionId } from "../domain/medical-condition/MedicalConditionId";
import { MedicalConditionMap } from "../mappers/MedicalConditionMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';
import { ICD11Code } from '../domain/shared/ICD11Code';

@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
  private models: any;

  constructor(
    @Inject('medicalConditionSchema') private medicalConditionSchema: Model<IMedicalConditionPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    };
  }

  /**
   * Check if a medical condition exists.
   */
  public async exists(medicalCondition: MedicalCondition): Promise<boolean> {
    const codeX = medicalCondition.code instanceof ICD11Code ? (<ICD11Code>medicalCondition.code) : medicalCondition.code;

    const query = { code: codeX };
    const medicalConditionDocument = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);

    return !!medicalConditionDocument === true;
  }

  /**
   * Save a medical condition (create or update).
   */
  public async save(medicalCondition: MedicalCondition): Promise<MedicalCondition> {
    console.log("Saving medical condition: ", medicalCondition);
    
    const exists = await this.exists(medicalCondition);
    console.log("Medical condition ", exists);
    

    try {
      if (exists) {
        const query = { medicalConditionId : medicalCondition.id };
        const update = MedicalConditionMap.toPersistence(medicalCondition);

        const medicalConditionRecord = await this.medicalConditionSchema.findOneAndUpdate(query as FilterQuery<IMedicalConditionPersistence & Document>, update, { new: true });

        return MedicalConditionMap.toDomain(medicalConditionRecord);
      } else {
        const newMedicalCondition = MedicalConditionMap.toPersistence(medicalCondition);

        const medicalConditionRecord = await this.medicalConditionSchema.create(newMedicalCondition);

        return MedicalConditionMap.toDomain(medicalConditionRecord);
      }

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * Find a medical condition by its domain ID.
   */
  public async findByDomainId(id: string | string): Promise<MedicalCondition> {
    
    const medicalConditionId = MedicalConditionId.create(id);
    
    console.log("Finding by domain ID: ", medicalConditionId);
    const idx = medicalConditionId instanceof MedicalConditionId ? (<MedicalConditionId>medicalConditionId).id.toValue() : medicalConditionId;
console.log("IDX: ", idx);
    const query = { medicalConditionId: idx };
    console.log("Query: ", query);
    const medicalConditionRecord = await this.medicalConditionSchema.findOne( query );
console.log("Medical condition record: ", medicalConditionRecord);
    if( medicalConditionRecord != null) {
      console.log("Mapping to domain: ", medicalConditionRecord);
      return MedicalConditionMap.fromPersistence(medicalConditionRecord);
      // console.log("a: ", a);
      // return MedicalConditionMap.toDomain(medicalConditionRecord as any);
    }
    else return null;
  }

  /**
   * Find a medical condition by its ICD-11 code.
   */
  public async findByCode(code: ICD11Code): Promise<MedicalCondition | null> {
    const query = { code: code.toString() };
    const medicalConditionRecord = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);

    if (medicalConditionRecord != null) {
      return MedicalConditionMap.toDomain(medicalConditionRecord);
    } else {
      return null;
    }
  }

  /**
   * Find all medical conditions.
   */
  public async findAll(): Promise<MedicalCondition[]> {
    const medicalConditions = await this.medicalConditionSchema.find();

    if(medicalConditions.length === 0) return [];
    else return Promise.all(medicalConditions.map(MedicalConditionMap.toDomain));
  }

  /**
   * Delete a medical condition by its ID.
   */
  public async delete(medicalCondition: MedicalCondition): Promise<void> {
    try {
      console.log("Medical Condition: ", medicalCondition);
      const query = { medicalConditionId: medicalCondition.id.toString() };
      console.log("Query: ", query);
      await this.medicalConditionSchema.deleteOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
      console.log("Deletion successful.");
    } catch (err) {
      console.error("Error deleting medical condition:", err);
      throw err; 
    }
  }
  
}
