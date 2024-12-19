import {ICD11Code} from "../shared/ICD11Code";
import {ValueObject} from "../../core/domain/ValueObject";

export class MedicalRecordEntryProps {
    code: ICD11Code;
    date: Date;
}

export class MedicalRecordEntry extends ValueObject<MedicalRecordEntryProps> {
    get code (): ICD11Code {
        return this.props.code;
    }

    get date (): Date {
        return this.props.date;
    }
    
    constructor(props: MedicalRecordEntryProps) {
        super(props);
    }

    public static create(arg0: ICD11Code, arg1: Date) {
        return new MedicalRecordEntry({code: arg0, date: arg1});
    }
}