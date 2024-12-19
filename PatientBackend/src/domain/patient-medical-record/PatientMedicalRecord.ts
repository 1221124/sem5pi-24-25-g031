import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from '../../core/logic/Result';
import { MedicalRecordEntry } from "../medical-record-entry/MedicalRecordEntry";
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

    public addMedicalCondition(medicalCondition: MedicalRecordEntry) {
        const index = this.props.medicalConditions.findIndex((mc) => mc.code.value === medicalCondition.code.value);
        if (index === -1) {
            this.props.medicalConditions.push(medicalCondition);
        } else {
            throw new Error("Medical condition already exists.");
        }
    }

    public updateMedicalCondition(medicalCondition: MedicalRecordEntry) {
        const index = this.props.medicalConditions.findIndex((mc) => mc.code.value === medicalCondition.code.value);
        if (index !== -1) {
            this.props.medicalConditions[index] = medicalCondition;
        } else {
            throw new Error("Medical condition not found.");
        }
    }

    public deleteMedicalCondition(medicalCondition: MedicalRecordEntry) {
        const index = this.props.medicalConditions.findIndex((mc) => mc.code.value === medicalCondition.code.value);
        if (index !== -1) {
            this.props.medicalConditions.splice(index, 1);
        } else {
            throw new Error("Medical condition not found.");
        }
    }

    public addAllergy(allergy: MedicalRecordEntry) {
        const index = this.props.allergies.findIndex((a) => a.code.value === allergy.code.value);
        if (index === -1) {
            this.props.allergies.push(allergy);
        } else {
            throw new Error("Allergy already exists.");
        }
    }

    public updateAllergy(allergy: MedicalRecordEntry) {
        const index = this.props.allergies.findIndex((a) => a.code.value === allergy.code.value);
        if (index !== -1) {
            this.props.allergies[index] = allergy;
        } else {
            throw new Error("Allergy not found.");
        }
    }

    public deleteAllergy(allergy: MedicalRecordEntry) {
        const index = this.props.allergies.findIndex((a) => a.code.value === allergy.code.value);
        if (index !== -1) {
            this.props.allergies.splice(index, 1);
        } else {
            throw new Error("Allergy not found.");
        }
    }
}