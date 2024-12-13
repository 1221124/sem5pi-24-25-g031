import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface ICD11CodeProps {
    value: string;
}

export class ICD11Code extends ValueObject<ICD11CodeProps> {
    get value (): string {
        return this.props.value;
    }

    private constructor (props: ICD11CodeProps) {
        super(props);
    }

    public static create (code: string): Result<ICD11Code> {
        const guardResult = Guard.againstNullOrUndefined(code, 'code');
        if (!guardResult.succeeded) {
            return Result.fail<ICD11Code>(guardResult.message);
        }
        const icd11Code = new ICD11Code({ value: code });
        return Result.ok<ICD11Code>(icd11Code);
    }
}