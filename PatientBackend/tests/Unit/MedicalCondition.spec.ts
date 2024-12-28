// Import your class and other dependencies
import { vi, describe, it, expect, beforeEach } from 'vitest';
import sinon from 'sinon';

import { MedicalCondition } from '../../src/domain/medical-condition/MedicalCondition';
import { ICD11Code } from '../../src/domain/shared/ICD11Code';
import { Name } from '../../src/domain/shared/Name';
import { Description } from '../../src/domain/shared/Description';
import { CommonSymptom } from '../../src/domain/medical-condition/CommonSyptom';
import { Guard } from '../../src/core/logic/Guard';
import { UniqueEntityID } from '../../src/core/domain/UniqueEntityID';
import { MedicalConditionId } from '../../src/domain/medical-condition/MedicalConditionId';


describe('MedicalCondition', () => {
    const mockCode = ICD11Code.create('A00');
    const mockName = Name.create('Flu');
    const mockDescription = Description.create('A viral infection');
    const mockCommonSymptoms = [CommonSymptom.create('Fever'), CommonSymptom.create('Cough')];
  
    let medicalConditionProps;
    let medicalCondition;
  
    beforeEach(() => {
      medicalConditionProps = {
        code: mockCode,
        name: mockName,
        description: mockDescription,
        commonSymptoms: mockCommonSymptoms,
      };
  
      // Create the medical condition instance before each test
      const result = MedicalCondition.create(medicalConditionProps);
      medicalCondition = result.getValue();
    });
  
    describe('create', () => {
      it('should successfully create a medical condition', () => {
        // Stubbing the Guard function to return a successful result
        vi.spyOn(Guard, 'againstNullOrUndefinedBulk').mockImplementationOnce(() => ({ succeeded: true, message: '' }));
  
        const result = MedicalCondition.create(medicalConditionProps);
  
        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBeInstanceOf(MedicalCondition);
      });
  
      it('should fail to create a medical condition with invalid props', () => {
        // Stubbing the Guard function to return a failure result
        vi.spyOn(Guard, 'againstNullOrUndefinedBulk').mockImplementationOnce(() => ({ succeeded: false, message: 'Invalid parameters' }));
  
        const result = MedicalCondition.create(medicalConditionProps);
  
        expect(result.isSuccess).toBe(false);
        expect(result.error).toBe('Invalid parameters');
      }); 
    });
  
    describe('getters and setters', () => {
        it('should return the correct medicalConditionId', () => {
            const uniqueId = MedicalConditionId.create();
            vi.spyOn(MedicalConditionId, 'create').mockImplementationOnce(() => uniqueId);

            const props = {
                code: ICD11Code.create('1A00').getValue(),
                name: Name.create('example-name').getValue(),
                description: Description.create('example-description').getValue(),
                commonSymptoms: [],
            };

            const medicalCondition = MedicalCondition.create(props, uniqueId.id).getValue();


            expect(medicalCondition.id.toValue).toEqual(uniqueId.id.toValue);
            
          });
  
      it('should return the correct code', () => {
        expect(medicalCondition.code).toEqual(mockCode);
      });
  
      it('should return the correct name', () => {
        expect(medicalCondition.name).toEqual(mockName);
      });
  
      it('should return and modify the description', () => {
        // Getter Test
        expect(medicalCondition.description).toEqual(mockDescription);
  
        // Setter Test
        const newDescription = Description.create('A severe viral infection');
        medicalCondition.description = newDescription;
  
        expect(medicalCondition.description).toEqual(newDescription);
      });
  
      it('should return and modify commonSymptoms', () => {
        // Getter Test
        expect(medicalCondition.commonSymptoms).toEqual(mockCommonSymptoms);
  
        // Setter Test
        const newSymptoms = [CommonSymptom.create('Fatigue')];
        medicalCondition.commonSymptoms = newSymptoms;
  
        expect(medicalCondition.commonSymptoms).toEqual(newSymptoms);
      });
    });
  });