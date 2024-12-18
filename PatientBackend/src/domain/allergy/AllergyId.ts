import { v4 as uuidv4, validate as isUuidValid } from 'uuid';

export class AllergyId {
    private readonly id: string;
    
    constructor(id?: string) {
        if(id && !isUuidValid(id)) {
            throw new Error("Invalid GUID format for AllergyId");
        }
        this.id = id || uuidv4();
    }
    
    public getId(): string {
        return this.id;
    }
    
    public equals(other: AllergyId): boolean {
        return this.id === other.id;
    }  
}