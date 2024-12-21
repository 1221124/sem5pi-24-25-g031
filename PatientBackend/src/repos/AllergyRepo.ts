import IAllergyRepo from "../services/IRepos/IAllergyRepo";
import {Inject, Service} from "typedi";
import {Allergy} from "../domain/allergy/Allergy";
import {Document, FilterQuery, Model } from "mongoose";
import {IAllergyPersistence} from "../dataschema/IAllergyPersistence";
import {AllergyId} from "../domain/allergy/AllergyId";
import {AllergyMap} from "../mappers/AllergyMap";

@Service()
export default class AllergyRepo implements IAllergyRepo {

    constructor(
        @Inject('allergySchema') private allergySchema: Model<IAllergyPersistence & Document>
    ) {}

    /*
    private createBaseQuery (): any {
        return {
            where: {},
        };
    }

     */

    public async exists(allergy: Allergy): Promise<boolean> {

        // const idX = medicalCondition.id instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.id).toValue() : medicalCondition.id;

        // const query = { domainId: idX };
        // const medicalConditionDocument = await this.medicalConditionSchema.findOne(query as FilterQuery<IMedicalConditionPersistence & Document>);

        // return !!medicalConditionDocument === true;

        return false;
    }

    public async save(allergy: Allergy): Promise<Allergy> {
        const query = { domainId: allergy.id.toString()};

        const schema = await this.allergySchema.findOne(query);

        try {
            if (schema === null) {
                const rawAllergy: any = AllergyMap.toPersistence(allergy);

                const allergyCreated = await this.allergySchema.create(rawAllergy);

                return AllergyMap.toDomain(allergyCreated);
            } else {
                schema.set(AllergyMap.toPersistence(allergy));

                await schema.save();

                return AllergyMap.toDomain(schema);
            }
        } catch (error) {
            throw error;
        }
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

    public async findAll(): Promise<Allergy[]> {
        const allergy = await this.allergySchema.find();
        console.log("REPO: allergies" + allergy);
        if(allergy.length === 0) return [];
        else return Promise.all(allergy.map(AllergyMap.toDomain));
    }

}
