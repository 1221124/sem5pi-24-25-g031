import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

const MRN_REGEX = /^\d{4}\d{2}\d{6}$/;

interface MedicalRecordNumberProps {
    value: string;
}

export class MedicalRecordNumber extends ValueObject<MedicalRecordNumberProps> {
    get value (): string {
        return this.props.value;
    }

    private constructor (props: MedicalRecordNumberProps) {
        super(props);
    }

    public static create (value: string): Result<MedicalRecordNumber> {
        const guardResult = Guard.againstNullOrUndefined(value, 'value');
        console.log("guardResult = " + guardResult);
        if (!guardResult.succeeded) {
            return Result.fail<MedicalRecordNumber>(guardResult.message);
        }

        // if(!MRN_REGEX.test(value)) {
        //     return Result.fail<MedicalRecordNumber>("Invalid medical record number format.")
        // }

        const medicalRecordNumber = new MedicalRecordNumber({ value: value });
        return Result.ok<MedicalRecordNumber>(medicalRecordNumber);
    }

    public getValue(): string {
        return this.props.value;
    }
}