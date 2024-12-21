import {ICD11Code} from "../../domain/shared/ICD11Code";
import {Name} from "../../domain/shared/Name";
import {Description} from "../../domain/shared/Description";

export class AllergyDto {
    id: string;
    code: ICD11Code;
    name: Name;
    description: Description;
    
    constructor(id: string, code: ICD11Code, name: Name, description: Description) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
    }
}
