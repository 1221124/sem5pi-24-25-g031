import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Guard } from '../../core/logic/Guard';
import { Result } from '../../core/logic/Result';
import { Description } from '../shared/Description';
import { ICD11Code } from '../shared/ICD11Code';
import { Name } from '../shared/Name';
import { CommonSymptom } from './CommonSyptom';
import { MedicalConditionId } from './MedicalConditionId';

interface MedicalConditionProps {
    code: ICD11Code;
    name: Name;
    description: Description;
    commonSymptoms: CommonSymptom[];
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {
    get id(): UniqueEntityID {
        return MedicalConditionId.caller(this.id);
    }

    get medicalConditionId(): MedicalConditionId {
        return MedicalConditionId.caller(this.id);
    }

    get code(): ICD11Code {
        return this.props.code;
    }

    get name(): Name {
        return this.props.name;
    }

    get description(): Description {
        return this.props.description;
    }

    get commonSymptoms(): CommonSymptom[] {
        return this.props.commonSymptoms;
    }

    private constructor(props: MedicalConditionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: MedicalConditionProps, id?: UniqueEntityID): Result<MedicalCondition> {
        
        const guardedProps = [
            { argument: props.code, argumentName: 'code' },
            { argument: props.name, argumentName: 'name' },
            { argument: props.description, argumentName: 'description' },
            { argument: props.commonSymptoms, argumentName: 'commonSymptoms' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<MedicalCondition>(guardResult.message);
        }else{
            const medicalCondition = new MedicalCondition({
                ...props
            }, id);

            return Result.ok<MedicalCondition>(medicalCondition);
        }
    }

    public updateFromRequest (request: MedicalCondition): void {
        if (request.description !== null && request.description !== undefined) {
            this.props.description = request.description;
        }
        if (request.commonSymptoms !== null && request.commonSymptoms !== undefined) {
            this.props.commonSymptoms = request.commonSymptoms;
        }
    }
}