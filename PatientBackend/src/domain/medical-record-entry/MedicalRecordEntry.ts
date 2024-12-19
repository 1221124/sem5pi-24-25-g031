import {ICD11Code} from "../shared/ICD11Code";
import {AggregateRoot} from "../../core/domain/AggregateRoot";
import {ValueObject} from "../../core/domain/ValueObject";

export class MedicalRecordEntryProps {
    code: ICD11Code;
    date: Date;
}

export class CommonSymptom extends ValueObject<MedicalRecordEntryProps> {

    get code (): ICD11Code {
        return this.props.code;
    }

    get date (): Date {
        return this.props.date;
    }
    
    constructor(props: MedicalRecordEntryProps) {
        super(props);
    }
}