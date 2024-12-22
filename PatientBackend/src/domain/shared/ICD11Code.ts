import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

const ICD11_REGEX = /^[A-HJ-NP-Z0-9][A-HJ-NP-Z][0-9][A-HJ-NP-Z0-9](\.[A-HJ-NP-Z0-9]{1,2})?$/;

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
        console.log("guardResult = " + guardResult);
        if (!guardResult.succeeded) {
            return Result.fail<ICD11Code>(guardResult.message);
        }

        if(!ICD11_REGEX.test(code)) {
            return Result.fail<ICD11Code>("Invalid ICD-11 code format.")
        }

        const icd11Code = new ICD11Code({ value: code });
        return Result.ok<ICD11Code>(icd11Code);
    }

    public toString(): string {
        return this.value;
    }
}