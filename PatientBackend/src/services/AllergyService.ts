import {Inject, Service} from "typedi";
import config from "../../config";
import IAllergyService from "./IServices/IAllergyService";
import IAllergyRepo from "./IRepos/IAllergyRepo";
import {CreatingAllergyDto} from "../dto/allergy/CreatingAllergyDto";

import {Result} from "../core/logic/Result";
import {AllergyDto} from "../dto/allergy/AllergyDto";
import {AllergyMap} from "../mappers/AllergyMap";
import {UpdatingAllergyDto} from "../dto/allergy/UpdatingAllergyDto";
import {ICD11Code} from "../domain/shared/ICD11Code";

@Service()

export default class AllergyService implements IAllergyService {
    constructor(
        @Inject(config.repos.allergy.name) private allergyRepo: IAllergyRepo
    ) {}

    /**
     * Retrieves a medical condition by its ID.
     */
    public async getAllergyById(id: string): Promise<Result<AllergyDto>> {
        try {
            const allergy = await this.allergyRepo.findByDomainId(id);
            
            if (!allergy) {
                return Result.fail<AllergyDto>("Allergy not found");
            }

            const allergyDTO = AllergyMap.toDto(allergy);
            return Result.ok<AllergyDto>(allergyDTO);
        } catch (error) {
            throw error; // Rethrow to be handled by the controller.
        }
    }
    
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

    public async validateICD11Code(code: string): Promise<Result<boolean>> {
        try {
            const icd11Code = ICD11Code.create(code);
            if (icd11Code.isFailure) {
                return Result.fail<boolean>(icd11Code.error);
            }
            const exists = await this.allergyRepo.findByCode(icd11Code.getValue());
            //returns true if the code exists, false otherwise
            return Result.ok<boolean>(exists != null);
        } catch (error) {
            throw error;
        }
    }
}