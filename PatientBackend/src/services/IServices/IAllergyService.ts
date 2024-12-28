import { Result } from "../../core/logic/Result";
import {CreatingAllergyDto} from "../../dto/allergy/CreatingAllergyDto";
import {AllergyDto} from "../../dto/allergy/AllergyDto";
import {UpdatingAllergyDto} from "../../dto/allergy/UpdatingAllergyDto";

export default interface IAllergyService  {
    createAllergy(dto: CreatingAllergyDto): Promise<Result<AllergyDto>>;
    getAll(filters: {code?: string, name?: string, description?: string}): Promise<AllergyDto[]>;
    updateAllergy(id: string, dto: UpdatingAllergyDto): Promise<Result<AllergyDto>>;
    validateICD11Code(code: string): Promise<Result<boolean>>;
}