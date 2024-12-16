import { Service, Inject } from 'typedi';

import IMedicalConditionRepo from "../services/IRepos/IMedicalConditionRepo";
import { MedicalCondition } from "../domain/medical-condition/MedicalCondition";
import { MedicalConditionId } from "../domain/medical-condition/MedicalConditionId";
import { MedicalConditionMap } from "../mappers/MedicalConditionMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';

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
    // const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;

    // const query = { domainId: idX };
    // const medicalConditionDocument = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);

    // return !!medicalConditionDocument === true;

    return false;
  }

  /**
   * Save a medical condition (create or update).
   */
  public async save(medicalCondition: MedicalCondition): Promise<MedicalCondition> {
    // const query = { domainId: medicalCondition.id.toString() };

    // const medicalConditionDocument = await this.medicalConditionSchema.findOne(query);

    // try {
    //   if (medicalConditionDocument === null) {
    //     const rawMedicalCondition: any = MedicalConditionMap.toPersistence(medicalCondition);

    //     const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);

    //     return MedicalConditionMap.toDomain(medicalConditionCreated);
    //   } else {
    //     medicalConditionDocument.name = medicalCondition.name; // Update any relevant fields
    //     await medicalConditionDocument.save();

    //     return medicalCondition;
    //   }
    // } catch (err) {
    //   throw err;
    // }

    return null;
  }

  /**
   * Find a medical condition by its domain ID.
   */
  public async findByDomainId(medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {
    const query = { domainId: medicalConditionId };
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
    // const medicalConditions = await this.medicalConditionSchema.find();

    // return medicalConditions.map(MedicalConditionMap.toDomain);

    return [];
  }

  /**
   * Delete a medical condition by its ID.
   */
  public async delete(medicalCondition: MedicalCondition): Promise<void> {
    const query = { domainId: medicalCondition.id.toString() };

    await this.medicalConditionSchema.deleteOne(query as FilterQuery<IMedicalConditionPersistence & Document>);
  }
}
