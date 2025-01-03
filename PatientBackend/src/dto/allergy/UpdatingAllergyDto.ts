import {Description} from "../../domain/shared/Description";
import {Result} from "../../core/logic/Result";

export class UpdatingAllergyDto {
    description: Description;

    constructor(description: Description) {
        this.description = description ?? Description.create(null).getValue();
    }

    public static create(description: string): Result<UpdatingAllergyDto> {
        const AllergyDescription = Description.create(description);

        const updatingAllergyDto = new UpdatingAllergyDto(
            AllergyDescription.getValue()
        );
        return Result.ok<UpdatingAllergyDto>(updatingAllergyDto);
    }
}