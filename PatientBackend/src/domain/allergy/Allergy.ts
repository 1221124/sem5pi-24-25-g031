import { Description } from "../shared/Description";
import { ICD11Code } from "../shared/ICD11Code";
import { Name } from "../shared/Name";

export class Allergy {
    private code: ICD11Code;
    private name: Name;
    private description: Description;

    constructor(code: ICD11Code, name: Name, description: Description) {
        this.code = code;
        this.name = name;
        this.description = description;
    }
}