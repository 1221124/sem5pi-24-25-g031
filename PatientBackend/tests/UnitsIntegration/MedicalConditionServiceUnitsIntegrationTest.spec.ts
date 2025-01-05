import { before, describe } from "node:test";
import { beforeEach, expect, it, vi } from "vitest";
import MedicalConditionService from "../../src/services/MedicalConditionService"; // Adjust the import path as necessary
import { UniqueEntityID } from "../../src/core/domain/UniqueEntityID";
import { MedicalConditionId } from "../../src/domain/medical-condition/MedicalConditionId";
import { Name } from "../../src/domain/shared/Name";
import { Description } from "../../src/domain/shared/Description";
import { CommonSymptom } from "../../src/domain/medical-condition/CommonSyptom"; // Adjust the import path as necessary
import { ICD11Code } from "../../src/domain/shared/ICD11Code";
import { MedicalCondition } from "../../src/domain/medical-condition/MedicalCondition";
import { CreatingMedicalConditionDto } from "../../src/dto/medical-condition/CreatingMedicalConditionDto";
import { MedicalConditionMap } from "../../src/mappers/MedicalConditionMap";
import { Result } from "../../src/core/logic/Result";
import { ok } from "assert";

const medicalConditionRepoMock = {
    save: vi.fn(),
    findByDomainId: vi.fn(),
    findByCode: vi.fn(),
    findAll: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
}

describe ('MedicalConditionService Integration Tests with Repository Isolation', () => {
    let service: MedicalConditionService;
    let domainId: UniqueEntityID;
    let medicalConditionId: MedicalConditionId;
    let medicalConditionName: Name;
    let medicalConditionCode : ICD11Code;
    let medicalConditionDescription: Description;
    let medicalConditionCommonSymptoms: CommonSymptom[];

    beforeEach(() => {
        service = new MedicalConditionService(medicalConditionRepoMock);
        domainId = new UniqueEntityID();
        medicalConditionId = MedicalConditionId.create(domainId.toString());
        medicalConditionName = Name.create('Test Medical Condition').getValue();
        medicalConditionCode = ICD11Code.create('1A00').getValue();
        medicalConditionDescription = Description.create('Test Medical Condition Description').getValue();        
        medicalConditionCommonSymptoms = [CommonSymptom.create('Test Common Symptoms').getValue()];
    });

    it('should create a new medical condition', async () => {
        // Arrange
        const newMedicalConditionDto = CreatingMedicalConditionDto.create(
            medicalConditionCode.value,
            medicalConditionName.value,
            medicalConditionDescription.value,
            medicalConditionCommonSymptoms.map(symptom => symptom.value)
        ).getValue();

        console.log("newMedicalConditionDto: ", newMedicalConditionDto);

        const mockMedicalCondition: MedicalCondition = MedicalCondition.create({
            code: medicalConditionCode,
            name: medicalConditionName,
            description: medicalConditionDescription,
            commonSymptoms: medicalConditionCommonSymptoms,
        }, domainId).getValue();

        console.log("mockMedicalCondition: ", mockMedicalCondition);

        medicalConditionRepoMock.findByDomainId.mockReturnValue(Promise.resolve(null));
        medicalConditionRepoMock.exists.mockReturnValue(Promise.resolve(false));
        medicalConditionRepoMock.save.mockReturnValue(Promise.resolve(mockMedicalCondition));

        // Act
        const result = await service.createMedicalCondition(newMedicalConditionDto);
        console.log("Result: ", result);

        console.log("Result.getValue(): ", result.getValue());

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(medicalConditionRepoMock.save).toHaveBeenCalledTimes(1);
        expect(result.getValue().code.props.value).toStrictEqual(mockMedicalCondition.code);
        expect(result.getValue().name.props.value).toStrictEqual(mockMedicalCondition.name);
        expect(result.getValue().description.value).toStrictEqual(mockMedicalCondition.description);
        expect(result.getValue().commonSymptoms.map(symptom => symptom.value)).toStrictEqual(mockMedicalCondition.commonSymptoms.map(symptom => symptom));
    });

    it('should return a medical condition by its domain ID', async () => {
        // Arrange
        const mockMedicalCondition: MedicalCondition = MedicalCondition.create({
            code: medicalConditionCode,
            name: medicalConditionName,
            description: medicalConditionDescription,
            commonSymptoms: medicalConditionCommonSymptoms,
        }, domainId).getValue();

        medicalConditionRepoMock.exists.mockReturnValue(Promise.resolve(true));
        medicalConditionRepoMock.findByDomainId.mockReturnValue(Promise.resolve(mockMedicalCondition));

        // Act
        const result = await service.getMedicalConditionById(domainId.toString());

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(medicalConditionRepoMock.findByDomainId).toHaveBeenCalledTimes(1);
        expect(result.getValue().code.props.value).toStrictEqual(mockMedicalCondition.code.getValue());
        expect(result.getValue().name.props.value).toStrictEqual(mockMedicalCondition.name.getValue());
        expect(result.getValue().description.value).toStrictEqual(mockMedicalCondition.description.getValue());
        expect(result.getValue().commonSymptoms.map(symptom => symptom)).toStrictEqual(mockMedicalCondition.commonSymptoms.map(symptom => symptom));
    });

    it('should validate a valid ICD-11 code', async () => {
        // Arrange
        const validICD11Code = '1A00';

        // Act
        const result = await service.validateICD11Code(validICD11Code);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBe(false);
    });

    it('should not validate an invalid ICD-11 code', async () => {
        // Arrange
        const invalidICD11Code = '1A000';

        // Act
        const result = await service.validateICD11Code(invalidICD11Code);

        // Assert
        expect(result.isFailure).toBe(true);
    });

    it('should return all medical conditions', async () => {
        // Arrange
        const mockMedicalCondition: MedicalCondition = MedicalCondition.create({
            code: medicalConditionCode,
            name: medicalConditionName,
            description: medicalConditionDescription,
            commonSymptoms: medicalConditionCommonSymptoms,
        }, domainId).getValue();

        medicalConditionRepoMock.findAll.mockReturnValue(Promise.resolve([mockMedicalCondition]));

        // Act
        const result = await service.getAll();

        // Assert
        expect(result.length).toBe(1);
        expect(result[0].code.props.value).toStrictEqual(mockMedicalCondition.code.getValue());
        expect(result[0].name.props.value).toStrictEqual(mockMedicalCondition.name.getValue());
        expect(result[0].description.value).toStrictEqual(mockMedicalCondition.description.getValue());
        expect(result[0].commonSymptoms.map(symptom => symptom)).toStrictEqual(mockMedicalCondition.commonSymptoms.map(symptom => symptom));
    });

    it('should not return any medical conditions if none exist', async () => {
        // Arrange
        medicalConditionRepoMock.findAll.mockReturnValue(Promise.resolve([]));

        // Act
        const result = await service.getAll();

        // Assert
        expect(result.length).toBe(0);
    });

    it('should delete a medical condition', async () => {
        // Arrange
        const mockMedicalCondition: MedicalCondition = MedicalCondition.create({
            code: medicalConditionCode,
            name: medicalConditionName,
            description: medicalConditionDescription,
            commonSymptoms: medicalConditionCommonSymptoms,
        }, domainId).getValue();

        medicalConditionRepoMock.exists.mockReturnValue(Promise.resolve(true));
        medicalConditionRepoMock.findByDomainId.mockReturnValue(Promise.resolve(mockMedicalCondition));
        medicalConditionRepoMock.delete.mockReturnValue(Promise.resolve(Result));

        // Act
        const result = await service.deleteMedicalCondition(domainId.toString());

        // Assert
        expect(result.isSuccess).toBe(true);
    });
});