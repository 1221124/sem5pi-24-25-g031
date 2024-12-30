import {ICD11Code} from "../../domain/shared/ICD11Code";
import {Name} from "../../domain/shared/Name";
import {Description} from "../../domain/shared/Description";

export class CreatingAllergyDto {
    code: ICD11Code;
    name: Name;
    description: Description;
    
    constructor(code: ICD11Code, name: Name, description: Description) {
        this.code = code;
        this.name = name;
        this.description = description;
    }

    public static create (code: string, name: string, description: string): CreatingAllergyDto {
        const icd11Code = ICD11Code.create(code).getValue();
        const allergyName = Name.create(name).getValue();
        const allergyDescription = Description.create(description).getValue();
        return new CreatingAllergyDto(icd11Code, allergyName, allergyDescription);
    }
}