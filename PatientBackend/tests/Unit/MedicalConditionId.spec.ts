import { MedicalConditionId } from '../../src/domain/medical-condition/MedicalConditionId';
import { UniqueEntityID } from '../../src/core/domain/UniqueEntityID';
import { describe, expect, it } from 'vitest';

describe('MedicalConditionId', () => {
    describe('create', () => {
        it('should create a new MedicalConditionId with a generated UniqueEntityID if no id is provided', () => {
            // Act
            const medicalConditionId = MedicalConditionId.create();

            // Assert
            expect(medicalConditionId).toBeInstanceOf(MedicalConditionId);
            expect(medicalConditionId.id).toBeInstanceOf(UniqueEntityID);
        });

        it('should create a new MedicalConditionId with the provided id', () => {
            // Arrange
            const validId = '12345-67890-abcdef';

            // Act
            const medicalConditionId = MedicalConditionId.create(validId);

            // Assert
            expect(medicalConditionId).toBeInstanceOf(MedicalConditionId);
            expect(medicalConditionId.id.toString()).toEqual(validId);
        });

        it('should create different MedicalConditionIds for different calls without id', () => {
            // Act
            const medicalConditionId1 = MedicalConditionId.create();
            const medicalConditionId2 = MedicalConditionId.create();

            // Assert
            expect(medicalConditionId1.id.toString()).not.toEqual(medicalConditionId2.id.toString());
        });

        it('should create a MedicalConditionId even with an empty string as id', () => {
            // Arrange
            const emptyId = '';

            // Act
            const medicalConditionId = MedicalConditionId.create(emptyId);

            // Assert
            expect(medicalConditionId).toBeInstanceOf(MedicalConditionId);
            expect(medicalConditionId.id.toString()).not.toEqual(emptyId.toString());
        });

        it('should create a MedicalConditionId with non-UUID string', () => {
            // Arrange
            const nonUuidId = 'non-uuid-id';

            // Act
            const medicalConditionId = MedicalConditionId.create(nonUuidId);

            // Assert
            expect(medicalConditionId).toBeInstanceOf(MedicalConditionId);
            expect(medicalConditionId.id.toString()).toEqual(nonUuidId);
        });
    });

    describe('id getter', () => {
        it('should return the correct UniqueEntityID', () => {
            // Arrange
            const validId = 'unique-id-12345';
            const medicalConditionId = MedicalConditionId.create(validId);

            // Act
            const retrievedId = medicalConditionId.id;

            // Assert
            expect(retrievedId).toBeInstanceOf(UniqueEntityID);
            expect(retrievedId.toString()).toEqual(validId);
        });
    });
});
