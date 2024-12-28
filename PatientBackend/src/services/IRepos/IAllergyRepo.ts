import {Repo} from "../../core/infra/Repo";
import {Allergy} from "../../domain/allergy/Allergy";
import {ICD11Code} from "../../domain/shared/ICD11Code";
import {MedicalCondition} from "../../domain/medical-condition/MedicalCondition";

export default interface IAllergyRepo extends Repo<Allergy> {

    save(allergy: Allergy): Promise<Allergy>;

    findAll(filters: { code?: string; name?: string; description?: string }): Promise<Allergy[]>;

    findByDomainId(id: string): Promise<Allergy | null>;

    delete(allergy: Allergy): Promise<void>;

    findByCode(code: ICD11Code): Promise<Allergy> | null;
}
