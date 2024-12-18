import {Allergy} from "../domain/allergy/Allergy";
import {AllergyDto} from "../dto/allergy/AllergyDto";
import {ICD11Code} from "../domain/shared/ICD11Code";
import {Name} from "../domain/shared/Name";
import {Description} from "../domain/shared/Description";
import {UniqueEntityID} from "../core/domain/UniqueEntityID";

export class AllergyMap {
    public static toDto (allergy: Allergy): AllergyDto {
        return {
            code: allergy.code,
            name: allergy.name,
            description: allergy.description
        } as AllergyDto;
    }
    
    public static async toDomain (raw: any): Promise<Allergy> {
        const codeOrError = ICD11Code.create(raw.code);
        const nameOrError = Name.create(raw.name);
        const descriptionOrError = Description.create(raw.description);
        
        const allergyOrError = Allergy.create({
            code: codeOrError.getValue(),
            name: nameOrError.getValue(),
            description: descriptionOrError.getValue()
        }, new UniqueEntityID(raw.allergyId));
        
        allergyOrError.isFailure ? console.log(allergyOrError.error) : '';
        
        return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
    }
    
    public static toPersistence (allergy: Allergy): any {
        return {
            allergyId: allergy.id.toString(),
            code: allergy.code.value,
            name: allergy.name.value,
            description: allergy.description.value
        };
    }
}