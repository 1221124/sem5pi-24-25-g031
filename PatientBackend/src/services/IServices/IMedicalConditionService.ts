import { Result } from "../../core/logic/Result";
import { CreatingMedicalConditionDto } from "../../dto/medical-condition/CreatingMedicalConditionDto";
import { MedicalConditionDto } from "../../dto/medical-condition/MedicalConditionDto";

export default interface IMedicalConditionService  {
    //validateICD11Code
    validateICD11Code(code: string): Promise<Result<boolean>>;
    //createMedicalCondition
    createMedicalCondition(creatingMedicalCondition: CreatingMedicalConditionDto): Promise<Result<MedicalConditionDto>>;
}
