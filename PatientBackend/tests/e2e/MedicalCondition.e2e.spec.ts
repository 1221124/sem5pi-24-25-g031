import { beforeEach, describe, expect, it, vi } from "vitest";
import MedicalConditionService from "../../src/services/MedicalConditionService";
import { UniqueEntityID } from "../../src/core/domain/UniqueEntityID";
import { MedicalConditionId } from "../../src/domain/medical-condition/MedicalConditionId";
import { ICD11Code } from "../../src/domain/shared/ICD11Code";
import { Name } from "../../src/domain/shared/Name";
import { Description } from "../../src/domain/shared/Description";
import { CreatingMedicalConditionDto } from "../../src/dto/medical-condition/CreatingMedicalConditionDto";
import { CommonSymptom } from "../../src/domain/medical-condition/CommonSyptom";
import { MedicalCondition } from "../../src/domain/medical-condition/MedicalCondition";

const mockRepo = {
    save: vi.fn(),
    findByDomainId: vi.fn(),
    findByCode: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
};

describe('Medical Condition E2E Tests', () => {
    let service: MedicalConditionService; 
    let domainId: UniqueEntityID;
    let medicalConditionId: MedicalConditionId;
    let code: ICD11Code;
    let name: Name;
    let description: Description;
    let commonSymptoms: CommonSymptom[];

    beforeEach(() => {
        service = new MedicalConditionService(mockRepo);
        domainId = new UniqueEntityID('ae101eb7-a23e-49fb-a5af-5dcfb7d5b55f');
        medicalConditionId = MedicalConditionId.create(domainId.toString());
        code = ICD11Code.create('1A00').getValue();
        name = Name.create('Test Medical Condition 1').getValue();
        description = Description.create('Test Medical Condition Description 1').getValue();
        commonSymptoms = [
            CommonSymptom.create('Symptom1').getValue(),
            CommonSymptom.create('Symptom2').getValue(),
        ];
        vi.resetAllMocks();
    });

    it('should create a new medical condition', async () => {
        const commonSymptomsValue: string[] = ['Symptom1', 'Symptom2'];
        const dto = CreatingMedicalConditionDto.create(
            code.value,
            name.value,
            description.value,
            commonSymptomsValue
        ).getValue();

        const domainObject = MedicalCondition.create({
            code: code,
            name: name,
            description: description,
            commonSymptoms: commonSymptoms,
        }, domainId).getValue();

        mockRepo.save.mockResolvedValue(domainObject);

        const result = await service.createMedicalCondition(dto);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().code.props.value).toBe(dto.code);
        expect(result.getValue().name.props.value).toBe(dto.name);
        expect(result.getValue().description.props.value).toBe(dto.description);
        expect(mockRepo.save).toHaveBeenCalledWith(expect.any(MedicalCondition));
      });
      
      it('should retrieve a medical condition by ID', async () => {
        const domainObject = MedicalCondition.create({
            code: code,
            name: name,
            description: description,
            commonSymptoms: commonSymptoms,
        }, domainId).getValue();

        mockRepo.findByDomainId.mockResolvedValue(domainObject);

        const result = await service.getMedicalConditionById(medicalConditionId.id.toString());

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().code.props.value).toBe(code.value);
        expect(result.getValue().name.props.value).toBe(name.value);
        expect(result.getValue().description.props.value).toBe(description.value);
        expect(mockRepo.findByDomainId).toHaveBeenCalledWith(expect.any(String));
      });

      it('should update a medical condition by ID', async () => {
        const domainObject = MedicalCondition.create({
            code: code,
            name: name,
            description: description,
            commonSymptoms: commonSymptoms,
        }, domainId).getValue();

        mockRepo.findByDomainId.mockResolvedValue(domainObject);
        mockRepo.save.mockResolvedValue(domainObject);

        const result = await service.updateMedicalCondition(medicalConditionId.id.toString(), {
            description: description,
            commonSymptoms: commonSymptoms,
        });

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().code.props.value).toBe(code.value);
        expect(result.getValue().name.props.value).toBe(name.value);
        expect(result.getValue().description.props.value).toBe(description.value);
        expect(mockRepo.findByDomainId).toHaveBeenCalledWith(expect.any(String));
        expect(mockRepo.save).toHaveBeenCalledWith(expect.any(MedicalCondition));
      });

      it('should delete a medical condition by ID', async () => {
        const domainObject = MedicalCondition.create({
            code: code,
            name: name,
            description: description,
            commonSymptoms: commonSymptoms,
        }, domainId).getValue();

        mockRepo.findByDomainId.mockResolvedValue(domainObject);
        mockRepo.delete.mockResolvedValue(undefined);

        const result = await service.deleteMedicalCondition(medicalConditionId.id.toString());

        expect(result.isSuccess).toBe(true);
        expect(mockRepo.findByDomainId).toHaveBeenCalledWith(expect.any(String));
        expect(mockRepo.delete).toHaveBeenCalledWith(expect.any(MedicalCondition));
      });
});