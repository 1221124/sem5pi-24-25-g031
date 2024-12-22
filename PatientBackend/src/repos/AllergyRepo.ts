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

    public async findAll(filters: { code?: string; name?: string; description?: string }): Promise<Allergy[]> {
        try {
            const query: any = {};

            if (filters.code) query['code'] = filters.code;
            if (filters.name) query['name'] = { $regex: new RegExp(filters.name, 'i') }; // Busca parcial, case-insensitive
            if (filters.description) query['description'] = { $regex: new RegExp(filters.description, 'i') }; // Busca parcial, case-insensitive

            console.log("REPO: Applying filters to query.", query);

            const allergies = await this.allergySchema.find(query);
            console.log("REPO: allergies found", allergies);

            if (allergies.length === 0) return [];
            else return Promise.all(allergies.map(AllergyMap.toDomain));
        } catch (error) {
            console.log("REPO: Error finding allergies.", error);
            throw error;
        }
    }

    public async delete(allergy: Allergy): Promise<void> {
        const query = { allergyId: allergy.id.toString() };

        await this.allergySchema.deleteOne(query as FilterQuery<IAllergyPersistence & Document>);
    } catch (error: any) {
        throw error;
    }

}
