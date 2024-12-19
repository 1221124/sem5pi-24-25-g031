import { Entity } from '../../core/domain/Entity';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';

export class PatientMedicalRecordId extends UniqueEntityID {
    // get id (): UniqueEntityID {
    //     return this._id;
    // }

    // private constructor (id?: UniqueEntityID) {
    //     super(null, id)
    // }

    public static create(id?: string): PatientMedicalRecordId {
        return new PatientMedicalRecordId(id);
    }
}
