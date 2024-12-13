import { Description } from '../shared/Description';
import { ICD11Code } from '../shared/ICD11Code';
import { Name } from '../shared/Name';
import { CommonSymptom } from './CommonSyptom';
import { MedicalConditionId } from './MedicalConditionId';

export class MedicalCondition {
    id: MedicalConditionId;
    code: ICD11Code;
    name: Name;
    description: Description;
    commonSymptoms: CommonSymptom[];

    constructor(
        code: ICD11Code,
        name: Name,
        description: Description,
        commonSymptoms: CommonSymptom[]
    ) {
        this.id = new MedicalConditionId();
        this.code = code;
        this.name = name;
        this.description = description;
        this.commonSymptoms = commonSymptoms;
    }

    updateFromRequest(request: { description?: Description; commonSymptoms?: CommonSymptom[] }) {
        if (request.description) {
            this.description = request.description;
        }
        if (request.commonSymptoms) {
            this.commonSymptoms = request.commonSymptoms;
        }
    }
}