import {Inject, Service} from "typedi";
import config from "../../config";
import IAllergyService from "./IServices/IAllergyService";
import IAllergyRepo from "./IRepos/IAllergyRepo";
import {CreatingAllergyDto} from "../dto/allergy/CreatingAllergyDto";

import {Result} from "../core/logic/Result";
import {AllergyDto} from "../dto/allergy/AllergyDto";
import {AllergyMap} from "../mappers/AllergyMap";

@Service()

export default class AllergyService implements IAllergyService {
    constructor(
        @Inject(config.repos.allergy.name) private allergyRepo: IAllergyRepo
    ) {}

    public async createAllergy(dto: CreatingAllergyDto): Promise<Result<AllergyDto>> {
        try {
            const creatingAllergy = AllergyMap.toDomain(dto);

            if (!creatingAllergy) {
                return Result.fail<AllergyDto>(creatingAllergy);
            }

            await this.allergyRepo.save(await creatingAllergy);

            const allergyDTO = AllergyMap.toDto(await creatingAllergy);
            return Result.ok<AllergyDto>(allergyDTO);
        } catch (error) {
            return Result.fail<AllergyDto>(error);
        }
    }

    public async getAll(): Promise<AllergyDto[]> {
        try {
            console.log("\nSERVICE: Getting all allergies.");
            const allergies = await this.allergyRepo.findAll();
            console.log("\nSERVICE: allergies." + allergies);
            return allergies.map(AllergyMap.toDto);
        } catch (error) {
            console.log("\nSERVICE: Error getting all allergies." + error);
            throw error;
        }
    }
}