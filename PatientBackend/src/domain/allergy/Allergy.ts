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
    
    private constructor(props: AllergyProps, id?: AllergyId) {
        super(props, id);
    }
    
    public static create(props: AllergyProps, id?: AllergyId): Result<Allergy> {
        
        const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.name, argumentName: 'name' },
            { argument: props.description, argumentName: 'description' }
        ];
        
        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
        
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