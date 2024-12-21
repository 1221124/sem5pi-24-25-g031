import { Result } from "../../core/logic/Result";
import {CreatingAllergyDto} from "../../dto/allergy/CreatingAllergyDto";
import {AllergyDto} from "../../dto/allergy/AllergyDto";
import {UpdatingAllergyDto} from "../../dto/allergy/UpdatingAllergyDto";

export default interface IAllergyService  {
    createAllergy(dto: CreatingAllergyDto): Promise<Result<AllergyDto>>;
    getAll(): Promise<AllergyDto[]>;
    updateAllergy(id: string, dto: UpdatingAllergyDto): Promise<Result<AllergyDto>>;
}