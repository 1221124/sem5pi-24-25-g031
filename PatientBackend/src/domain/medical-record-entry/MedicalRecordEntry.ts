import { ICD11Code } from "../shared/ICD11Code";
import { ValueObject } from "../../core/domain/ValueObject";

export class MedicalRecordEntryProps {
    code: ICD11Code;
    date: Date;
    notMeaningfulAnyMore: boolean;
}

export class MedicalRecordEntry extends ValueObject<MedicalRecordEntryProps> {
    get code(): ICD11Code {
        return this.props.code;
    }

    get date(): Date {
        return this.props.date;
    }

    get notMeaningfulAnyMore(): boolean {
        return this.props.notMeaningfulAnyMore;
    }
    
    constructor(props: MedicalRecordEntryProps) {
        super(props);
    }

    public static create(arg0: ICD11Code, arg1: Date) {
        return new MedicalRecordEntry({ code: arg0, date: arg1, notMeaningfulAnyMore: false });
    }

    public static createWithNotMeaningfulAnyMore(arg0: ICD11Code, arg1: Date, arg2: boolean | string) {
        if (typeof arg2 === 'string') {
            console.log("arg2 = " + arg2);
            arg2 = (arg2 === 'true') ? true : false;
        }
        console.log("arg2 as bool = " + arg2);
        return new MedicalRecordEntry({ code: arg0, date: arg1, notMeaningfulAnyMore: arg2 });
    }

    public toggleNotMeaningfulAnyMore(notMeaningfulAnyMore: boolean): MedicalRecordEntry {
        if (this.props.notMeaningfulAnyMore !== notMeaningfulAnyMore) {
            return new MedicalRecordEntry({
                ...this.props,
                notMeaningfulAnyMore
            });
        }
        return this;
    }

    public updateDate(newDate: Date): MedicalRecordEntry {
        if (this.props.date.getTime() !== newDate.getTime()) {
            return new MedicalRecordEntry({
                ...this.props,
                date: newDate
            });
        }
        return this;
    }

    public toString(): string {
        return `${this.props.code.toString()}_${this.props.date.toISOString()}`;
    }
}