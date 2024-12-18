import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

const ICD11_REGEX = /^[A-Z]{1}[0-9]{1,2}[A-Z0-9]{0,3}(\.[0-9]{1,3})?$/; //TODO: Find a better regex

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

        // if(!ICD11_REGEX.test(code)) {
        //     return Result.fail<ICD11Code>("Invalid ICD-11 code format.")
        // }

        const icd11Code = new ICD11Code({ value: code });
        return Result.ok<ICD11Code>(icd11Code);
    }
}