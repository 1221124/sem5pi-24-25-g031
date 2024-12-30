import { describe, it, expect, vi } from 'vitest';
import { MedicalRecordNumber } from '../../src/domain/patient-medical-record/MedicalRecordNumber';
import { MedicalRecordEntry } from '../../src/domain/medical-record-entry/MedicalRecordEntry';
import { PatientMedicalRecord } from '../../src/domain/patient-medical-record/PatientMedicalRecord';
import { PatientMedicalRecordId } from '../../src/domain/patient-medical-record/PatientMedicalRecordId';
import { ICD11Code } from '../../src/domain/shared/ICD11Code';
import { CreatingPatientMedicalRecordDto } from '../../src/dto/patient-medical-record/CreatingPatientMedicalRecordDto';
import { PatientMedicalRecordMap } from '../../src/mappers/PatientMedicalRecordMap';

describe('PatientMedicalRecordMap', () => {

  it('should map PatientMedicalRecord to DTO correctly', () => {
    const medicalRecordNumber = MedicalRecordNumber.create('202412000001').getValue();
    const allergies = [MedicalRecordEntry.createWithNotMeaningfulAnyMore(ICD11Code.create('1A00').getValue(), new Date('2023-01-01'), false)];
    const medicalConditions = [MedicalRecordEntry.createWithNotMeaningfulAnyMore(ICD11Code.create('1B00').getValue(), new Date('2023-02-01'), false)];

    const patientMedicalRecord = PatientMedicalRecord.create({
      medicalRecordNumber,
      allergies,
      medicalConditions,
    }, new PatientMedicalRecordId()).getValue();

    const dto = PatientMedicalRecordMap.toDto(patientMedicalRecord);

    expect(dto).toEqual({
        id: patientMedicalRecord.id.toString(),
        medicalRecordNumber: medicalRecordNumber, 
        allergies: allergies,
        medicalConditions: medicalConditions 
    });
  });

  it('should map raw data to domain model correctly', () => {
    const raw = {
      patientMedicalRecordId: '1',
      medicalRecordNumber: '202412000001',
      allergies: ['1A00_2023-01-01T00:00:00.000Z_false'],
      medicalConditions: ['1B00_2023-02-01T00:00:00.000Z_false'],
    };

    const patientMedicalRecord = PatientMedicalRecordMap.toDomain(raw);

    expect(patientMedicalRecord.medicalRecordNumber.value).toBe('202412000001');
    expect(patientMedicalRecord.allergies.length).toBe(1);
    expect(patientMedicalRecord.medicalConditions.length).toBe(1);
  });

  it('should map CreatingPatientMedicalRecordDto to domain model correctly', () => {
    const medicalRecordNumber = MedicalRecordNumber.create('202412000001').getValue();
    const raw = new CreatingPatientMedicalRecordDto(medicalRecordNumber);

    const patientMedicalRecord = PatientMedicalRecordMap.toDomainfromCreating(raw);

    expect(patientMedicalRecord.medicalRecordNumber.value).toBe('202412000001');
    expect(patientMedicalRecord.allergies).toHaveLength(0);
    expect(patientMedicalRecord.medicalConditions).toHaveLength(0);
  });

  it('should map PatientMedicalRecord to persistence format correctly', () => {
    const medicalRecordNumber = MedicalRecordNumber.create('202412000001').getValue();
    const allergies = [MedicalRecordEntry.createWithNotMeaningfulAnyMore(ICD11Code.create('1A00').getValue(), new Date('2023-01-01'), false)];
    const medicalConditions = [MedicalRecordEntry.createWithNotMeaningfulAnyMore(ICD11Code.create('1B00').getValue(), new Date('2023-02-01'), false)];

    const patientMedicalRecord = PatientMedicalRecord.create({
      medicalRecordNumber,
      allergies,
      medicalConditions,
    }, new PatientMedicalRecordId()).getValue();

    const persistence = PatientMedicalRecordMap.toPersistence(patientMedicalRecord);

    expect(persistence).toEqual({
      patientMedicalRecordId: patientMedicalRecord.id.toString(),
      medicalRecordNumber: '202412000001',
      allergies: ['1A00_2023-01-01T00:00:00.000Z_false'],
      medicalConditions: ['1B00_2023-02-01T00:00:00.000Z_false']
    });
  });

  it('should map raw data from persistence to domain model correctly', () => {
    const raw = {
      patientMedicalRecordId: '1',
      medicalRecordNumber: '202412000001',
      allergies: ['1A00_2023-01-01T00:00:00.000Z_false'],
      medicalConditions: ['1B00_2023-02-01T00:00:00.000Z_false'],
    };

    const patientMedicalRecord = PatientMedicalRecordMap.fromPersistence(raw);

    expect(patientMedicalRecord.medicalRecordNumber.value).toBe('202412000001');
    expect(patientMedicalRecord.allergies.length).toBe(1);
    expect(patientMedicalRecord.medicalConditions.length).toBe(1);
  });

});