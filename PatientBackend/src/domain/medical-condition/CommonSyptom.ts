import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface CommonSymptomProps {
    value: string;
}

export class CommonSymptom extends ValueObject<CommonSymptomProps> {
    get value (): string {
        return this.props.value;
    }

    private constructor (props: CommonSymptomProps) {
        super(props);
    }

    public static create (commonSymptom: string): Result<CommonSymptom> {
        const guardResult = Guard.againstNullOrUndefined(commonSymptom, 'commonSymptom');
        if (!guardResult.succeeded) {
            return Result.fail<CommonSymptom>(guardResult.message);
        } else {
            return Result.ok<CommonSymptom>(new CommonSymptom({ value: commonSymptom}))
        }
    }
}