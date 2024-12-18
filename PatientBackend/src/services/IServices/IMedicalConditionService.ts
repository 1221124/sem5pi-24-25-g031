import { Result } from "../../core/logic/Result";
import { CreatingMedicalConditionDto } from "../../dto/medical-condition/CreatingMedicalConditionDto";
import { MedicalConditionDto } from "../../dto/medical-condition/MedicalConditionDto";

export default interface IMedicalConditionService  {
    //createMedicalCondition
    createMedicalCondition(creatingMedicalCondition: CreatingMedicalConditionDto): Promise<Result<MedicalConditionDto>>;
}
