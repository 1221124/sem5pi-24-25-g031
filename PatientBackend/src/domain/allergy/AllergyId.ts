import {Entity} from "../../core/domain/Entity";
import {UniqueEntityID} from "../../core/domain/UniqueEntityID";

export class AllergyId extends Entity<any>{
    get id (): UniqueEntityID {
        return this._id;
    }

    private constructor (id?: UniqueEntityID) {
        super(null, id);
    }

    public static create(id?: string): AllergyId {
        const uniqueId = id ? new UniqueEntityID(id) : new UniqueEntityID();
        return new AllergyId(uniqueId);
    }

}