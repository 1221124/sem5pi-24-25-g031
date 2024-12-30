import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface NameProps {
    value: string;
}

export class Name extends ValueObject<NameProps> {
    get value (): string {
        return this.props.value;
    }

    private constructor (props: NameProps) {
        super(props);
    }

    public static create (name: string): Result<Name>{
        const guardResult = Guard.againstNullOrUndefined(name, 'name');
        if (!guardResult.succeeded){
            return Result.fail<Name>(guardResult.message);
        } else {
            return Result.ok<Name>(new Name({ value: name}))
        }
    }

    public getValue(): string {
        return this.value;
    }
}