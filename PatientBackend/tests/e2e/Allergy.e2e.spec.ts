import { describe, it, expect, beforeEach, vi } from 'vitest';
import AllergyService from "../../src/services/AllergyService";
import {CreatingAllergyDto} from "../../src/dto/allergy/CreatingAllergyDto";
import {Allergy} from "../../src/domain/allergy/Allergy";
import {UniqueEntityID} from "../../src/core/domain/UniqueEntityID";
import {AllergyId} from "../../src/domain/allergy/AllergyId";
import {ICD11Code} from "../../src/domain/shared/ICD11Code";
import {Name} from "../../src/domain/shared/Name";
import {Description} from "../../src/domain/shared/Description";
import {UpdatingAllergyDto} from "../../src/dto/allergy/UpdatingAllergyDto";


// Mock da dependência do repositório
const mockRepo = {
    findByDomainId: vi.fn(),
    findByCode: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
    findAll: vi.fn(),
};

describe('AllergyService', () => {
    let service: AllergyService;
    let domainId: UniqueEntityID;
    let allergyId: AllergyId;
    let allergyCode: ICD11Code;
    let name: Name;
    let description: Description;

    beforeEach(() => {
        service = new AllergyService(mockRepo);
        domainId = new UniqueEntityID('ae101eb7-a23e-49fb-a5af-5dcfb7d5b55f');
        allergyId = AllergyId.create(domainId.toString());
        allergyCode = ICD11Code.create('1A00').getValue();
        name = Name.create('Test Allergy 1').getValue();
        description = Description.create('Test Allergy Description 1').getValue();
        vi.resetAllMocks();
    });

    it('should create a new allergy', async () => {
        const dto = CreatingAllergyDto.create(
            allergyCode.value,
            name.value,
            description.value,
        ).getValue();

        const domainObject = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        mockRepo.save.mockResolvedValue(domainObject);

        const result = await service.createAllergy(dto);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().code.props.value).toBe(dto.code);
        expect(result.getValue().name.props.value).toBe(dto.name);
        expect(result.getValue().description.props.value).toBe(dto.description);
        expect(mockRepo.save).toHaveBeenCalledWith(expect.any(Allergy));
    });

    it('should retrieve an allergy by ID', async () => {
        const domainObject = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        mockRepo.findByDomainId.mockResolvedValue(domainObject);

        const result = await service.getAllergyById(domainId.toString());

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().code.props.value).toBe(allergyCode.value);
        expect(result.getValue().name.props.value).toBe(name.value);
        expect(result.getValue().description.props.value).toBe(description.value);
        expect(mockRepo.findByDomainId).toHaveBeenCalledWith(domainId.toString());
    });
    it('should validate an ICD11 code', async () => {
        mockRepo.findByCode.mockResolvedValue(true);

        const result = await service.validateICD11Code(allergyCode.value);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBe(true);
        expect(mockRepo.findByCode).toHaveBeenCalledWith(
            expect.objectContaining({ props: { value: allergyCode.value } })
        );
    });

    it('should list all allergies with filters', async () => {
        const filters = { code: allergyCode.value, name: name.value };
        const domainObjects = [
            Allergy.create({
                code: allergyCode,
                name: name,
                description: description,
            }, domainId).getValue(),
        ];

        mockRepo.findAll.mockResolvedValue(domainObjects);

        const result = await service.getAll(filters);

        expect(result).toHaveLength(1);
        expect(result[0].code.props.value).toBe(allergyCode.value);
        expect(result[0].name.props.value).toBe(name.value);
        expect(result[0].description.props.value).toBe(description.value);
        expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
    });

    it('should update an existing allergy', async () => {
        const domainObject = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        const updateDto = UpdatingAllergyDto.create(description.value).getValue();

        mockRepo.findByDomainId.mockResolvedValue(domainObject);
        mockRepo.save.mockResolvedValue(domainObject);

        const result = await service.updateAllergy(domainId.toString(), updateDto);

        console.log("result.getValue().description.props.value: ", result.getValue().description.props.value);
        console.log("updateDto.description: ", updateDto.description);
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().description).toBe(updateDto.description);
        expect(mockRepo.save).toHaveBeenCalledWith(expect.any(Allergy));
    });

    it('should delete an allergy', async () => {
        const domainObject = Allergy.create({
            code: allergyCode,
            name: name,
            description: description,
        }, domainId).getValue();

        mockRepo.findByDomainId.mockResolvedValue(domainObject);
        mockRepo.delete.mockResolvedValue(undefined);

        const result = await service.deleteAllergy(domainId.toString());

        expect(result.isSuccess).toBe(true);
        expect(mockRepo.delete).toHaveBeenCalledWith(domainObject);
    });


});