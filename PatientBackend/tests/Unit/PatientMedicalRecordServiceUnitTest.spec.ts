import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';
import IPatientMedicalRecordRepo from '../../src/services/IRepos/IPatientMedicalRecordRepo';
import PatientMedicalRecordService from '../../src/services/PatientMedicalRecordService';
import { CreatingPatientMedicalRecordDto } from '../../src/dto/patient-medical-record/CreatingPatientMedicalRecordDto';
import { MedicalRecordNumber } from '../../src/domain/patient-medical-record/MedicalRecordNumber';
import { UpdatingPatientMedicalRecordDto } from '../../src/dto/patient-medical-record/UpdatingPatientMedicalRecordDto';
import { PatientMedicalRecord } from '../../src/domain/patient-medical-record/PatientMedicalRecord';
import { UniqueEntityID } from '../../src/core/domain/UniqueEntityID';
import { ICD11Code } from '../../src/domain/shared/ICD11Code';
import { MedicalRecordEntry } from '../../src/domain/medical-record-entry/MedicalRecordEntry';
import { Result } from '../../src/core/logic/Result';
import { PatientMedicalRecordMap } from '../../src/mappers/PatientMedicalRecordMap';

const patientMedicalRecordRepoMock: Mocked<IPatientMedicalRecordRepo> = {
    findByDomainId: vi.fn(),
    findByMedicalRecordNumber: vi.fn(),
    findAll: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    exists: vi.fn(),
};

describe('PatientMedicalRecordService', () => {
    let service: PatientMedicalRecordService;

    let domainId: UniqueEntityID;
    let medicalRecordNumber: MedicalRecordNumber;

    let icd11Code1: ICD11Code;
    let icd11Code2: ICD11Code;

    let allergy: MedicalRecordEntry;
    let medicalCondition: MedicalRecordEntry;

    let newAllergy: MedicalRecordEntry;

    beforeEach(() => {
        service = new PatientMedicalRecordService(patientMedicalRecordRepoMock);

        domainId = new UniqueEntityID('ae101eb7-a23e-49fb-a5af-5dcfb7d5b55f');
        medicalRecordNumber = MedicalRecordNumber.create('202412000001').getValue();

        icd11Code1 = ICD11Code.create('1A00').getValue();
        icd11Code2 = ICD11Code.create('1B00').getValue();

        allergy = MedicalRecordEntry.create(icd11Code1, new Date());
        medicalCondition = MedicalRecordEntry.create(icd11Code2, new Date());

        newAllergy = MedicalRecordEntry.create(icd11Code1, new Date());
    });

    it('should return a patient medical record by ID', async () => {
        const mockPatientRecord: Promise<PatientMedicalRecord> = new Promise((resolve) => {
            resolve(PatientMedicalRecord.create({
                medicalRecordNumber: medicalRecordNumber,
                allergies: [],
                medicalConditions: [],
            }, domainId).getValue());
        });

        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(mockPatientRecord);

        const result = await service.getById(domainId.toString());

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toEqual({
            id: domainId.toString(),
            medicalRecordNumber: medicalRecordNumber,
            allergies: [],
            medicalConditions: [],
        });
    });

    it('should return error if patient medical record not found by ID', async () => {
        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(null));

        const result = await service.getById(domainId.toString());

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('Patient medical record not found');
    });

    it('should create a new patient medical record', async () => {
        const newRecordDto: CreatingPatientMedicalRecordDto = {
            medicalRecordNumber
        };

        const mockPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber,
            allergies: [],
            medicalConditions: [],
        }, domainId).getValue();

        vi.spyOn(PatientMedicalRecordMap, 'toDomainfromCreating').mockResolvedValue(mockPatientRecord);

        patientMedicalRecordRepoMock.findByMedicalRecordNumber.mockReturnValue(null);
        patientMedicalRecordRepoMock.save.mockReturnValue(Promise.resolve(mockPatientRecord));
        
        const result = await service.create(newRecordDto);

        if (result.isFailure) {
            throw new Error(result.error.toString());
        }
        
        expect(result.isSuccess).toBe(true);
        expect(result.getValue().medicalRecordNumber).toBe(medicalRecordNumber);
    });

    it('should return an error if the patient medical record already exists', async () => {
        const newRecordDto: CreatingPatientMedicalRecordDto = {
            medicalRecordNumber: medicalRecordNumber
        };

        const existingPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: [],
            medicalConditions: [],
        }, domainId).getValue();

        patientMedicalRecordRepoMock.findByMedicalRecordNumber.mockReturnValue(Promise.resolve(existingPatientRecord));

        const result = await service.create(newRecordDto);

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('Patient medical record already exists.');
    });

    it('should update a patient medical record', async () => {
        const existingPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: [allergy],
            medicalConditions: [medicalCondition],
        }, domainId).getValue();

        const updateDto: UpdatingPatientMedicalRecordDto = {
            allergies: [allergy, newAllergy],
            medicalConditions: [medicalCondition]
        };

        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(existingPatientRecord));
        patientMedicalRecordRepoMock.save.mockReturnValue(Promise.resolve(existingPatientRecord));

        const result = await service.update(domainId.toString(), updateDto);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue().allergies).toEqual([allergy, newAllergy]);
    });

    it('should return error if patient medical record not found for update', async () => {
        const updateDto: UpdatingPatientMedicalRecordDto = {
            allergies: [allergy, newAllergy],
            medicalConditions: [medicalCondition]
        };

        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(null));

        const result = await service.update(domainId.toString(), updateDto);

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('Patient medical record not found');
    });

    it('should delete a patient medical record', async () => {
        const existingPatientRecord: PatientMedicalRecord = PatientMedicalRecord.create({
            medicalRecordNumber: medicalRecordNumber,
            allergies: [],
            medicalConditions: [],
        }, domainId).getValue();

        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(existingPatientRecord));
        patientMedicalRecordRepoMock.delete.mockReturnValue(Promise.resolve(undefined));

        const result = await service.delete(domainId.toString());

        expect(result.isSuccess).toBe(true);
    });

    it('should return error if patient medical record not found for deletion', async () => {
        patientMedicalRecordRepoMock.findByDomainId.mockReturnValue(Promise.resolve(null));

        const result = await service.delete(domainId.toString());

        expect(result.isFailure).toBe(true);
        expect(result.error).toBe('Patient medical record not found');
    });
});