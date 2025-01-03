import {ICD11Code} from "../../domain/shared/ICD11Code";
import {Name} from "../../domain/shared/Name";
import {Description} from "../../domain/shared/Description";
import {Result} from "../../core/logic/Result";

export class CreatingAllergyDto {
    code: ICD11Code;
    name: Name;
    description: Description;
    
    constructor(code: ICD11Code, name: Name, description: Description) {
        this.code = code;
        this.name = name;
        this.description = description;
    }

    public static create (code: string, name: string, description: string): Result<CreatingAllergyDto> {
        const icd11Code = ICD11Code.create(code);
        const allergyName = Name.create(name);
        const allergyDescription = Description.create(description);

        const creatingAllergyDto = new CreatingAllergyDto(
            icd11Code.getValue(),
            allergyName.getValue(),
            allergyDescription.getValue()
        );

        return Result.ok<CreatingAllergyDto>(creatingAllergyDto);
    }
}