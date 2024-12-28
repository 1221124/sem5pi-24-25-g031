import { describe, it, expect, beforeEach, vi } from 'vitest';
import PatientMedicalRecordService from '../../src/services/PatientMedicalRecordService';
import { CreatingPatientMedicalRecordDto } from '../../src/dto/patient-medical-record/CreatingPatientMedicalRecordDto';
import { UpdatingPatientMedicalRecordDto } from '../../src/dto/patient-medical-record/UpdatingPatientMedicalRecordDto';
import { PatientMedicalRecord } from '../../src/domain/patient-medical-record/PatientMedicalRecord';
import { UniqueEntityID } from '../../src/core/domain/UniqueEntityID';
import { MedicalRecordNumber } from '../../src/domain/patient-medical-record/MedicalRecordNumber';
import { MedicalRecordEntry } from '../../src/domain/medical-record-entry/MedicalRecordEntry';
import { ICD11Code } from '../../src/domain/shared/ICD11Code';
import { PatientMedicalRecordMap } from '../../src/mappers/PatientMedicalRecordMap';

const patientMedicalRecordRepoMock = {
    findByDomainId: vi.fn(),
    findByMedicalRecordNumber: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
    findAll: vi.fn(),
};

describe('PatientMedicalRecordService Unit Tests with Total Isolation', () => {
    let service: PatientMedicalRecordService;
    let domainId: UniqueEntityID;
    let medicalRecordNumber: MedicalRecordNumber;
    let icd11Code1: ICD11Code;
    let icd11Code2: ICD11Code;
    let allergy: MedicalRecordEntry;
    let medicalCondition: MedicalRecordEntry;

    beforeEach(() => {
        service = new PatientMedicalRecordService(patientMedicalRecordRepoMock);
        domainId = new UniqueEntityID('ae101eb7-a23e-49fb-a5af-5dcfb7d5b55f');
        medicalRecordNumber = MedicalRecordNumber.create('202412000001').getValue();
        icd11Code1 = ICD11Code.create('1A00').getValue();
        icd11Code2 = ICD11Code.create('1B00').getValue();
        allergy = MedicalRecordEntry.create(icd11Code1, new Date());
        medicalCondition = MedicalRecordEntry.create(icd11Code2, new Date());
    });

    it('should create a new patient medical record', async () => {
        // Arrange
        const newRecordDto = CreatingPatientMedicalRecordDto.create(medicalRecordNumber.getValue()).getValue();

        const mockPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber,
            allergies: [],
            medicalConditions: [],
        }, domainId).getValue();

        patientMedicalRecordRepoMock.findByMedicalRecordNumber.mockReturnValue(Promise.resolve(null));
        patientMedicalRecordRepoMock.save.mockReturnValue(Promise.resolve(mockPatientRecord));

        // Act
        const result = await service.create(newRecordDto);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().medicalRecordNumber.getValue()).toBe(medicalRecordNumber.getValue());
    });

    it('should return an error if the patient medical record already exists', async () => {
        // Arrange
        const newRecordDto = CreatingPatientMedicalRecordDto.create(medicalRecordNumber.getValue()).getValue();

        const existingPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber,
            allergies: [],
            medicalConditions: [],
        }, domainId).getValue();

        patientMedicalRecordRepoMock.findByMedicalRecordNumber.mockReturnValue(Promise.resolve(existingPatientRecord));

        // Act
        const result = await service.create(newRecordDto);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('Patient medical record already exists.');
    });

    it('should update a patient medical record', async () => {
        // Arrange
        const existingPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: [allergy],
            medicalConditions: [medicalCondition],
        }, domainId).getValue();

        const updateDto: UpdatingPatientMedicalRecordDto = {
            allergies: [allergy],
            medicalConditions: [medicalCondition],
        };

        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(existingPatientRecord));
        patientMedicalRecordRepoMock.save.mockReturnValue(Promise.resolve(existingPatientRecord));

        // Act
        const result = await service.update(domainId.toString(), updateDto);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().medicalRecordNumber.getValue()).toBe(medicalRecordNumber.getValue());
    });

    it('should return an error if patient medical record not found for update', async () => {
        // Arrange
        const updateDto: UpdatingPatientMedicalRecordDto = {
            allergies: [allergy],
            medicalConditions: [medicalCondition],
        };

        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(null));

        // Act
        const result = await service.update(domainId.toString(), updateDto);

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('Patient medical record not found');
    });

    it('should delete a patient medical record', async () => {
        // Arrange
        const existingPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: [],
            medicalConditions: [],
        }, domainId).getValue();

        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(existingPatientRecord));
        patientMedicalRecordRepoMock.delete.mockReturnValue(Promise.resolve(undefined));

        // Act
        const result = await service.delete(domainId.toString());

        // Assert
        expect(result.isSuccess).toBe(true);
    });

    it('should return error if patient medical record not found for deletion', async () => {
        // Arrange
        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(null));

        // Act
        const result = await service.delete(domainId.toString());

        // Assert
        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('Patient medical record not found');
    });
});