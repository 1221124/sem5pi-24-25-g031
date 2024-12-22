import {Inject, Service} from "typedi";
import config from "../../config";
import IAllergyService from "./IServices/IAllergyService";
import IAllergyRepo from "./IRepos/IAllergyRepo";
import {CreatingAllergyDto} from "../dto/allergy/CreatingAllergyDto";

import {Result} from "../core/logic/Result";
import {AllergyDto} from "../dto/allergy/AllergyDto";
import {AllergyMap} from "../mappers/AllergyMap";
import {UpdatingAllergyDto} from "../dto/allergy/UpdatingAllergyDto";

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

    public async getAll(filters: { code?: string; name?: string; description?: string }): Promise<AllergyDto[]> {
        try {
            console.log("\nSERVICE: Getting all allergies with filters.", filters);
            const allergies = await this.allergyRepo.findAll(filters);
            console.log("\nSERVICE: allergies after filtering.", allergies);
            return allergies.map(AllergyMap.toDto);
        } catch (error) {
            console.log("\nSERVICE: Error getting all allergies.", error);
            throw error;
        }
    }


    public async updateAllergy(id: string, dto: UpdatingAllergyDto): Promise<Result<AllergyDto>> {
        try {
            const originalAllergy = await this.allergyRepo.findByDomainId(id);

            if (!originalAllergy) {
                return Result.fail<AllergyDto>("Allergy not found");
            }

            if (dto.description != null) {
                originalAllergy.description = dto.description;
            }

            await this.allergyRepo.save(originalAllergy);

            const allergyDTO = AllergyMap.toDto(originalAllergy);
            return Result.ok<AllergyDto>(allergyDTO);
        } catch (error) {
            throw error;
        }
    }

    public async deleteAllergy(id: string): Promise<Result<void>> {
        try {
            const allergy = await this.allergyRepo.findByDomainId(id);
            if (!allergy) {
                return Result.fail<void>("Allergy not found");
            }

            await this.allergyRepo.delete(allergy);

            return Result.ok<void>();
        } catch (error) {
            throw error;
        }
    }
}