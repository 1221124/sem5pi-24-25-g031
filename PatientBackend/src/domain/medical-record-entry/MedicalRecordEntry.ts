import {ICD11Code} from "../shared/ICD11Code";
import {ValueObject} from "../../core/domain/ValueObject";

export class MedicalRecordEntryProps {
    code: ICD11Code;
    date: Date;
    notMeaningfulAnyMore: boolean;
}

export class MedicalRecordEntry extends ValueObject<MedicalRecordEntryProps> {
    get code (): ICD11Code {
        return this.props.code;
    }

    get date (): Date {
        return this.props.date;
    }

    set date (date: Date) {
        this.props.date = date;
    }

    get notMeaningfulAnyMore (): boolean {
        return this.props.notMeaningfulAnyMore;
    }

    set notMeaningfulAnyMore (notMeaningfulAnyMore: boolean) {
        this.props.notMeaningfulAnyMore = notMeaningfulAnyMore;
    }
    
    constructor(props: MedicalRecordEntryProps) {
        super(props);
    }

    public static create(arg0: ICD11Code, arg1: Date) {
        return new MedicalRecordEntry({code: arg0, date: arg1, notMeaningfulAnyMore: false});
    }

    public static createWithNotMeaningfulAnyMore(arg0: ICD11Code, arg1: Date, arg2: boolean) {
        return new MedicalRecordEntry({code: arg0, date: arg1, notMeaningfulAnyMore: arg2});
    }

    public toggleNotMeaningfulAnyMore(notMeaningfulAnyMore: boolean) {
        if (this.props.notMeaningfulAnyMore !== notMeaningfulAnyMore) {
            this.notMeaningfulAnyMore = notMeaningfulAnyMore;
        }
    }

    public toString() {
        return `${this.props.code.toString()}_${this.props.date.toISOString()}`;
    }
}