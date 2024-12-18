import IAllergyRepo from "../services/IRepos/IAllergyRepo";
import {Inject, Service} from "typedi";
import {Allergy} from "../domain/allergy/Allergy";
import {Document, FilterQuery, Model, Promise} from "mongoose";
import {IAllergyPersistence} from "../dataschema/IAllergyPersistence";
import {AllergyId} from "../domain/allergy/AllergyId";
import {AllergyMap} from "../mappers/AllergyMap";

@Service()
export default class AllergyRepo implements IAllergyRepo {
    
    constructor(
        @Inject('allergySchema') private allergySchema: Model<IAllergyPersistence & Document>
    ) {}
    
    private createBaseQuery (): any {
        return {
            where: {},
        };
    }
    
    public async exists(allergy: Allergy): Promise<boolean> {

        // const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;

        // const query = { domainId: idX };
        // const medicalConditionDocument = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);

        // return !!medicalConditionDocument === true;
        
        return false;
    }

    public async save(allergy: Allergy): Promise<Allergy> {
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

    public async findByDomainId(allergyId: AllergyId | string): Promise<Allergy> {
        const query = { domainId: allergyId };
        const allergy = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);
        
        if (allergy != null) {
            return AllergyMap.toDomain(allergy);
        } else {
            return null;
        }
    }
    
}