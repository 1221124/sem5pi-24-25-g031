import {Allergy} from "../domain/allergy/Allergy";
import {AllergyDto} from "../dto/allergy/AllergyDto";
import {ICD11Code} from "../domain/shared/ICD11Code";
import {Name} from "../domain/shared/Name";
import {Description} from "../domain/shared/Description";
import {AllergyId} from "../domain/allergy/AllergyId";

export class AllergyMap {
    public static toDto (allergy: Allergy): AllergyDto {
        return {
            id: allergy.id.toString(),
            code: allergy.code,
            name: allergy.name,
            description: allergy.description
        } as AllergyDto;
    }
    
    public static toDomain (raw: any): Allergy {
        const allergyIdOrError = AllergyId.create(raw.allergyId);
        if (allergyIdOrError == null) throw new Error("AllergyId failed validation.");

        const codeOrError = ICD11Code.create(raw.code);
        if (codeOrError.isFailure) throw new Error("ICD11 code failed validation.");
        const code = codeOrError.getValue();

        const nameOrError = Name.create(raw.name);
        if (nameOrError.isFailure) throw new Error("Name failed validation.");
        const name = nameOrError.getValue();

        const descriptionOrError = Description.create(raw.description);
        if (descriptionOrError.isFailure) throw new Error("Description failed validation.");
        const description = descriptionOrError.getValue();
        
        const allergyOrError = Allergy.create({
            code: code,
            name: name,
            description: description
        }, allergyIdOrError.id);
        
        if (allergyOrError.isFailure) {
            throw new Error(allergyOrError.error.toString());
        }

        return allergyOrError.getValue();
    }
    
    public static toPersistence (allergy: Allergy): any {
        return {
            allergyId: allergy.id.toString(),
            code: allergy.code.value,
            name: allergy.name.value,
            description: allergy.description.value
        };
    }

    public static fromPersistence (raw: any): Allergy {
        const allergyId = AllergyId.create(raw.allergyId.toString());

        const codeOrError = ICD11Code.create(raw.code);
        if (codeOrError.isFailure) throw new Error("ICD11 code failed validation.");
        const code = codeOrError.getValue();

        const nameOrError = Name.create(raw.name);
        if (nameOrError.isFailure) throw new Error("Name failed validation.");
        const name = nameOrError.getValue();

        const descriptionOrError = Description.create(raw.description);
        if (descriptionOrError.isFailure) throw new Error("Description failed validation.");
        const description = descriptionOrError.getValue();

        return Allergy.create({
            code: code,
            name: name,
            description: description
        }, allergyId.id).getValue();
    }
}