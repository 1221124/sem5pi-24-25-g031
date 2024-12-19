import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from '../../core/logic/Result';
import { MedicalRecordEntry } from "../medical-record-entry/MedicalRecordEntry";
import { ICD11Code } from "../shared/ICD11Code";
import { MedicalRecordNumber } from "./MedicalRecordNumber";
import { PatientMedicalRecordId } from "./PatientMedicalRecordId";

interface PatientMedicalRecordProps {
    medicalRecordNumber: MedicalRecordNumber;
    allergies: MedicalRecordEntry[];
    medicalConditions: MedicalRecordEntry[];
}

export class PatientMedicalRecord extends AggregateRoot<PatientMedicalRecordProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get patientMedicalRecordId(): PatientMedicalRecordId {
        return new PatientMedicalRecordId(this.patientMedicalRecordId.toValue());
    }
    
    get medicalRecordNumber(): MedicalRecordNumber {
        return this.props.medicalRecordNumber;
    }

    get allergies(): MedicalRecordEntry[] {
        return this.props.allergies.map((allergy) => allergy);
    }

    set allergies(value: MedicalRecordEntry[]) {
        this.props.allergies = value;
    }

    get medicalConditions(): MedicalRecordEntry[] {
        return this.props.medicalConditions.map((condition) => condition);
    }

    set medicalConditions(value: MedicalRecordEntry[]) {
        this.props.medicalConditions = value;
    }

    private constructor(props: PatientMedicalRecordProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: PatientMedicalRecordProps, id?: UniqueEntityID): Result<PatientMedicalRecord> {
        
        console.log("Creating patient medical record: ", props);

        const guardedProps = [
            { argument: props.medicalRecordNumber, argumentName: 'medicalRecordNumber' },
            { argument: props.allergies, argumentName: 'allergies' },
            { argument: props.medicalConditions, argumentName: 'medicalConditions' }
        ];

        console.log("Guarded props: ", guardedProps);

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        console.log("Guard result: ", guardResult);

        if (!guardResult.succeeded) {
            return Result.fail<PatientMedicalRecord>(guardResult.message);
        }else{
            const patientMedicalRecord = new PatientMedicalRecord({
                ...props
            }, id);

            return Result.ok<PatientMedicalRecord>(patientMedicalRecord);
        }
    }
}