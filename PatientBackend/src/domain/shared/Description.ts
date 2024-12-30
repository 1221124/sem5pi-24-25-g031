import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

const MAX_CHARS = 2048;

interface DescriptionProps {
    value: string;
}

export class Description extends ValueObject<DescriptionProps> {
    get value (): string {
        return this.props.value;
    }

    private constructor (props: DescriptionProps) {
        super(props);
    }

    public static create (description: string): Result<Description> {
        const guardResult = Guard.againstNullOrUndefined(description, 'description');
        if (!guardResult.succeeded) {
            return Result.fail<Description>(guardResult.message);
        }
        return Result.ok<Description>(new Description({ value: description}))
            /*
        } else if (description.trim().length < MAX_CHARS) {
            return Result.ok<Description>(new Description({ value: description}))
        }

             */
    }

    public getValue(): string {
        return this.value;
    }
}