import {ICD11Code} from "../../domain/shared/ICD11Code";
import {Name} from "../../domain/shared/Name";
import {Description} from "../../domain/shared/Description";

export class AllergyDto {
    code: ICD11Code;
    name: Name;
    description: Description;
    
    constructor(code: ICD11Code, name: Name, description: Description) {
        this.code = code;
        this.name = name;
        this.description = description;
    }
}
