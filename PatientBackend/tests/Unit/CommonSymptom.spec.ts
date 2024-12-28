import { describe, expect, it } from 'vitest';
import { CommonSymptom } from '../../src/domain/medical-condition/CommonSyptom';

describe('CommonSymptom', () => {
    describe('create', () => {
        it('should create a valid CommonSymptom when provided a valid string', () => {
            // Arrange
            const validSymptom = 'Headache';

            // Act
            const result = CommonSymptom.create(validSymptom);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.getValue().value).toEqual(validSymptom);
        });

        it('should fail to create a CommonSymptom when input is null', () => {
            // Arrange
            const invalidSymptom = null;

            // Act
            const result = CommonSymptom.create(invalidSymptom);

            // Assert
            expect(result.isFailure).toBe(true);
            expect(result.error).toBe('commonSymptom is null or undefined');
        });

        it('should fail to create a CommonSymptom when input is undefined', () => {
            // Arrange
            const invalidSymptom = undefined;

            // Act
            const result = CommonSymptom.create(invalidSymptom);

            // Assert
            expect(result.isFailure).toBe(true);
            expect(result.error).toBe('commonSymptom is null or undefined');
        });

        it('should create a CommonSymptom with an empty string', () => {
            // Arrange
            const emptySymptom = '';

            // Act
            const result = CommonSymptom.create(emptySymptom);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.getValue().value).toEqual(emptySymptom);
        });

        it('should create a CommonSymptom with unusual characters', () => {
            // Arrange
            const unusualSymptom = '@#$%^&*!';

            // Act
            const result = CommonSymptom.create(unusualSymptom);

            // Assert
            expect(result.isSuccess).toBe(true);
            expect(result.getValue().value).toEqual(unusualSymptom);
        });
    });

    describe('value getter', () => {
        it('should return the correct value', () => {
            // Arrange
            const validSymptom = 'Fever';
            const result = CommonSymptom.create(validSymptom);

            // Act
            const commonSymptom = result.getValue();

            // Assert
            expect(commonSymptom.value).toEqual(validSymptom);
        });
    });
});
