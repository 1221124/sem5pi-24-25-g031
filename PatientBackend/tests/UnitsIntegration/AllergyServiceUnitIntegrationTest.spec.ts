import {describe, it, expect, beforeEach, vi} from 'vitest';
import AllergyService from "../../src/services/AllergyService";
import {UniqueEntityID} from "../../src/core/domain/UniqueEntityID";
import {ICD11Code} from "../../src/domain/shared/ICD11Code";
import {Name} from "../../src/domain/shared/Name";
import {Description} from "../../src/domain/shared/Description";
import {Allergy} from "../../src/domain/allergy/Allergy";
import {CreatingAllergyDto} from "../../src/dto/allergy/CreatingAllergyDto";
import {AllergyId} from "../../src/domain/allergy/AllergyId";
import {Result} from "../../src/core/logic/Result";

const allergyRepoMock = {
    findByDomainId: vi.fn(),
    findByCode: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
    findAll: vi.fn(),
}

describe('AllergyService Integration Tests with Repository Isolation', () => {
    let service: AllergyService;
    let domainId: UniqueEntityID;
    let allergyId: AllergyId;
    let allergyCode: ICD11Code;
    let name: Name;
    let description: Description;

    beforeEach(() => {
        service = new AllergyService(allergyRepoMock);
        domainId = new UniqueEntityID('ae101eb7-a23e-49fb-a5af-5dcfb7d5b55f');
        allergyId = AllergyId.create(domainId.toString());
        allergyCode = ICD11Code.create('1A00').getValue();
        name = Name.create('Test Allergy 1').getValue();
        description = Description.create('Test Allergy Description 1').getValue();
    });

    it('should create a new patient allergy', async () => {
        //Arrange
        const newAllergyDto = CreatingAllergyDto.create(
            allergyCode.value,
            name.value,
            description.value,
        ).getValue();

        const mockAllergy: Allergy = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        allergyRepoMock.findByDomainId.mockReturnValue(Promise.resolve(null));
        allergyRepoMock.exists.mockReturnValue(Promise.resolve(false));
        allergyRepoMock.save.mockReturnValue(Promise.resolve(mockAllergy));

        //Act
        const result = await service.createAllergy(newAllergyDto);

        //Assert
        expect(result.isSuccess).toBe(true);
        expect(allergyRepoMock.save).toHaveBeenCalledTimes(1);
        expect(result.getValue().code.props.value).toStrictEqual(mockAllergy.code);
        expect(result.getValue().name.props.value).toStrictEqual(mockAllergy.name);
        expect(result.getValue().description.props.value).toStrictEqual(mockAllergy.description);
    });

    it('should return an allergy by its domain ID', async () => {
        //Arrange
        const mockAllergy: Allergy = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        allergyRepoMock.exists.mockReturnValue(Promise.resolve(true));
        allergyRepoMock.findByDomainId.mockReturnValue(Promise.resolve(mockAllergy));

        //Act
        const result = await service.getAllergyById(domainId.toString());

        //Assert
        expect(result.isSuccess).toBe(true);
        expect(allergyRepoMock.findByDomainId).toHaveBeenCalledTimes(1);
        expect(result.getValue().code.props.value).toStrictEqual(allergyCode.value);
        expect(result.getValue().name.props.value).toStrictEqual(name.value);
        expect(result.getValue().description.props.value).toStrictEqual(description.value);
    });

    it('should validate a valid ICD-11 code', async () => {
        //Arrange
        const validICD11Code = '1A00';

        //Act
        const result = await service.validateICD11Code(validICD11Code);

        //Assert
        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBe(false);
    })

    it('should not validate an invalid ICD-11 code', async () => {
        //Arrange
        const invalidICD11Code = '1A000';

        //Act
        const result = await service.validateICD11Code(invalidICD11Code);

        //Assert
        expect(result.isFailure).toBe(true);
    });

    it('should return all allergies',async () => {
        //Arrange
        const mockAllergy: Allergy = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        allergyRepoMock.findAll.mockReturnValue(Promise.resolve([mockAllergy]));

        //Act
        const result = await service.getAll();

        expect(result.length).toBe(1);
        expect(result[0].code.props.value).toStrictEqual(allergyCode.value);
        expect(result[0].name.props.value).toStrictEqual(name.value);
        expect(result[0].description.props.value).toStrictEqual(description.value);
    });

    it('should not return any allergy if none exist', async () => {
        //Arrange
        allergyRepoMock.findAll.mockReturnValue(Promise.resolve([]));

        //Act
        const result = await service.getAll();

        //Assert
        expect(result.length).toBe(0);
    });

    it('should delete a allergy', async () => {
        const mockAllergy: Allergy = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        allergyRepoMock.findByDomainId.mockReturnValue(Promise.resolve(true));
        allergyRepoMock.delete.mockReturnValue(Promise.resolve(mockAllergy));
        allergyRepoMock.exists.mockReturnValue(Promise.resolve(Result));

        //Act
        const result = await service.deleteAllergy(domainId.toString());

        //Assert
        expect(result.isSuccess).toBe(true);
    });
});