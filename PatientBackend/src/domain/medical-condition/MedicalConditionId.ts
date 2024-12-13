import { v4 as uuidv4, validate as isUuidValid } from 'uuid';

export class MedicalConditionId {
    private readonly id: string;

    constructor(id?: string) {
        if (id && !isUuidValid(id)) {
            throw new Error("Invalid GUID format for MedicalConditionId");
        }
        this.id = id || uuidv4(); 
    }

    public getId(): string {
        return this.id;
    }

    public equals(other: MedicalConditionId): boolean {
        return this.id === other.id;
    }
}
