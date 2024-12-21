
import { Description } from "../shared/Description";
import { ICD11Code } from "../shared/ICD11Code";
import { Name } from "../shared/Name";
import {Aggregate} from "mongoose";
import {AggregateRoot} from "../../core/domain/AggregateRoot";
import {UniqueEntityID} from "../../core/domain/UniqueEntityID";
import {AllergyId} from "./AllergyId";
import {Result} from "../../core/logic/Result";
import {Guard} from "../../core/logic/Guard";

interface AllergyProps {
    code: ICD11Code;
    name: Name;
    description: Description;
}

export class Allergy extends AggregateRoot<AllergyProps>{

    get id(): UniqueEntityID {
        return this._id;
    }

    get allergyId(): AllergyId {
        return AllergyId.caller(this.id);
    }

    get code(): ICD11Code {
        return this.props.code;
    }

    get name(): Name {
        return this.props.name;
    }

    get description(): Description {
        return this.props.description;
    }

    private constructor(props: AllergyProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: AllergyProps, id?: UniqueEntityID): Result<Allergy> {

        console.log("ALLERGY: Creating allergy: ", props);

        const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.name, argumentName: 'name' },
            { argument: props.description, argumentName: 'description' }
        ];

        console.log("ALLERGY: Guarding props: ", guardedProps);

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        console.log("ALLERGY: Guard result: ", guardResult);

        if (!guardResult.succeeded) {
            return Result.fail<Allergy>(guardResult.message);
        }else{
            const allergy = new Allergy({
                ...props
            }, id);

            return Result.ok<Allergy>(allergy);
        }
    }

}