import {Repo} from "../../core/infra/Repo";
import {Allergy} from "../../domain/allergy/Allergy";

export default interface IAllergyRepo extends Repo<Allergy> {

    save(allergy: Allergy): Promise<Allergy>;

    findAll(): Promise<Allergy[]>;

    findByDomainId(id: string): Promise<Allergy | null>;
}
