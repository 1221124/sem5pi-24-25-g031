import { UniqueEntityID } from '../../core/domain/UniqueEntityID';

export class MedicalConditionId extends UniqueEntityID {
    constructor(id?: string) {
        super(id);
    }

    public static create(id: string): MedicalConditionId {
        return new MedicalConditionId(id);
    }
}
