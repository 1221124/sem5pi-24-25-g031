import { Result } from "../../core/logic/Result";
import {CreatingAllergyDto} from "../../dto/allergy/CreatingAllergyDto";
import {AllergyDto} from "../../dto/allergy/AllergyDto";

export default interface IAllergyService  {
    createAllergy(dto: CreatingAllergyDto): Promise<Result<AllergyDto>>;
    getAll(): Promise<AllergyDto[]>;
}