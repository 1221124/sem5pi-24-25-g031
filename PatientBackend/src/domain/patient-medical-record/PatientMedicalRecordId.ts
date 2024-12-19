import { Entity } from '../../core/domain/Entity';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';

export class PatientMedicalRecordId extends Entity<any> {
    get id (): UniqueEntityID {
        return this._id;
    }

    private constructor (id?: UniqueEntityID) {
        super(null, id)
    }

    public static create(id?: string): PatientMedicalRecordId {
        const uniqueId = id ? new UniqueEntityID(id) : new UniqueEntityID();
        return new PatientMedicalRecordId(uniqueId);
    }
}
