import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import MedicalConditionController from '../../src/controllers/MedicalConditionController'; // Adjust the import path
import MedicalConditionService from '../../src/services/MedicalConditionService'; // Adjust path
import { Result } from "../../src/core/logic/Result";
import { MedicalConditionDto } from '../../src/dto/medical-condition/MedicalConditionDto';
import { ICD11Code } from '../../src/domain/shared/ICD11Code';
import { Name } from '../../src/domain/shared/Name';
import { Description } from '../../src/domain/shared/Description';
import { CommonSymptom } from '../../src/domain/medical-condition/CommonSyptom';
import { MedicalCondition } from '../../src/domain/medical-condition/MedicalCondition';
import { Guard } from '../../src/core/logic/Guard';
import { MedicalConditionId } from '../../src/domain/medical-condition/MedicalConditionId';
import { UniqueEntityID } from '../../src/core/domain/UniqueEntityID';

describe('MedicalCondition', () => {
    const mockCodeResult = ICD11Code.create('1A00');
    const mockCode = mockCodeResult.getValue();
    const mockNameResult = Name.create('Flu');
    const mockName = mockNameResult.getValue();
    const mockDescriptionResult = Description.create('A viral infection');
    const mockDescription = mockDescriptionResult.getValue();
    const mockCommonSymptoms = [CommonSymptom.create('Fever').getValue(), CommonSymptom.create('Cough').getValue()];
    
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
    
        expect(result.getValue()).toBeInstanceOf(MedicalCondition);
      });
    
      it('should fail to create a medical condition with invalid props', () => {
        // Stubbing the Guard function to return a failure result
        vi.spyOn(Guard, 'againstNullOrUndefinedBulk').mockImplementationOnce(() => ({ succeeded: false, message: 'Invalid parameters' }));
    
        const result = MedicalCondition.create(medicalConditionProps);
    
        expect(result.isSuccess).toBe(false);
      });
    });
  
    describe('getters and setters', () => {
        it('should return the correct medicalConditionId', () => {
            const uniqueId = MedicalConditionId.create();
            vi.spyOn(MedicalConditionId, 'create').mockImplementationOnce(() => uniqueId);

            const props = {
                code: mockCodeResult.getValue(),
                name: mockNameResult.getValue(),
                description: mockDescriptionResult.getValue(),
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
  