import {ICD11Code} from "../../src/domain/shared/ICD11Code";
import {Name} from "../../src/domain/shared/Name";
import {Allergy} from "../../src/domain/allergy/Allergy";
import { describe, it, beforeEach, expect } from "vitest";
import {UniqueEntityID} from "../../src/core/domain/UniqueEntityID";
describe("Allergy Unit Tests", () => {
    let code;
    let name;
    let description;
    let allergy;

    beforeEach(() => {
        const codeResult = ICD11Code.create('1A00');
        if (!codeResult.isSuccess) {
            throw new Error("Failed to create ICD11Code: " + codeResult.errorValue());
        }
        code = codeResult.getValue();

        name = Name.create("Allergy Name").getValue();

        description = Name.create("Allergy Description").getValue();

        const allergyResult = Allergy.create({ code, name, description });
        if (!allergyResult.isSuccess) {
            throw new Error("Failed to create Allergy: " + allergyResult.errorValue());
        }
        allergy = allergyResult.getValue();
    })

    it("should create an Allergy instance using static create method", () => {
        expect(allergy.code).toEqual(code);
        expect(allergy.name).toEqual(name);
        expect(allergy.description).toEqual(description);
        expect(allergy.id).toBeDefined();
    });

    it("should fail when creating Allergy with missing required fields", () => {
        const allergyResult = Allergy.create({ code, name, description: null });
        expect(allergyResult.isSuccess).toBe(false);
        expect(allergyResult.errorValue()).toBe("description is null or undefined");
    });

    it("should fail when creating Allergy with null or undefined fields", () => {
        const allergyResult = Allergy.create({ code: null, name, description });
        expect(allergyResult.isSuccess).toBe(false);
        expect(allergyResult.errorValue()).toBe("code is null or undefined"); // Ajuste conforme o Guard

        const allergyResult2 = Allergy.create({ code, name: null, description });
        expect(allergyResult2.isSuccess).toBe(false);
        expect(allergyResult2.errorValue()).toBe("name is null or undefined");
    });

    it("should return an Allergy instance when valid data is provided", () => {
        const allergyResult = Allergy.create({ code, name, description });
        expect(allergyResult.isSuccess).toBe(true);
        const createdAllergy = allergyResult.getValue();
        expect(createdAllergy.code).toEqual(code);
        expect(createdAllergy.name).toEqual(name);
        expect(createdAllergy.description).toEqual(description);
    });

    it("should create Allergy with a provided ID", () => {
        const customId = new UniqueEntityID();
        const allergyResult = Allergy.create({ code, name, description }, customId);
        expect(allergyResult.isSuccess).toBe(true);
        const createdAllergy = allergyResult.getValue();
        expect(createdAllergy.id).toEqual(customId);
    });

    it("should fail if any required field is invalid", () => {
        const allergyResult = Allergy.create({ code: null, name, description });
        expect(allergyResult.isSuccess).toBe(false);
        expect(allergyResult.errorValue()).toBe("code is null or undefined");

        const allergyResult2 = Allergy.create({ code, name: null, description });
        expect(allergyResult2.isSuccess).toBe(false);
        expect(allergyResult2.errorValue()).toBe("name is null or undefined");

        const allergyResult3 = Allergy.create({ code, name, description: null });
        expect(allergyResult3.isSuccess).toBe(false);
        expect(allergyResult3.errorValue()).toBe("description is null or undefined");
    });


});