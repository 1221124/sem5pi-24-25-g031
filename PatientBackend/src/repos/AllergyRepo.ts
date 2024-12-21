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

        const idX = allergy.id instanceof AllergyId ? (<AllergyId>allergy.id) : allergy.id;

        const query = { allergyId: idX };

        const allergyDocument = await this.allergySchema.findOne(query as FilterQuery<IAllergyPersistence & Document>);

        return !!allergyDocument === true;
    }

    public async save(allergy: Allergy): Promise<Allergy> {

        const exists = await this.exists(allergy);

        try {
            if (exists) {
                const query = { allergyId : allergy.id };
                const update = AllergyMap.toPersistence(allergy);

                const allergyRecord = await this.allergySchema.findOneAndUpdate(query as FilterQuery<IAllergyPersistence & Document>, update, { new: true });

                return AllergyMap.toDomain(allergyRecord);
            } else {
                const newAllergy = AllergyMap.toPersistence(allergy);

                const allergyRecord = await this.allergySchema.create(newAllergy);

                return AllergyMap.toDomain(allergyRecord);
            }
        } catch (error) {
            throw error;
        }
    }

    public async findByDomainId(id: string): Promise<Allergy> {
        const allergyId = AllergyId.create(id);

        const idx = allergyId instanceof AllergyId ? (<AllergyId>allergyId).id.toValue() : allergyId;

        const query = { allergyId: idx };

        const allergy = await this.allergySchema.findOne( query );

        if(allergy != null) {
            return AllergyMap.fromPersistence(allergy);
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
