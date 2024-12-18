import {UniqueEntityID} from "../../core/domain/UniqueEntityID";

export class AllergyId extends UniqueEntityID{
    
    private constructor(id?: string) {
        super(id);
    }
    
    public static create(id?: string): AllergyId {
        return new AllergyId(id);
    }
}