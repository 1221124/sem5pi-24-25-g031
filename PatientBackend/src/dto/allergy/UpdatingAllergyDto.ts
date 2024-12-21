import {Description} from "../../domain/shared/Description";

export class UpdatingAllergyDto {
    description: Description;

    constructor(description: Description) {
        this.description = description ?? Description.create(null).getValue();
    }

    public static create(description: Description): UpdatingAllergyDto {
        return new UpdatingAllergyDto(description);
    }
}