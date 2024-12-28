import { describe, it, expect, beforeEach } from "vitest";
import { MedicalRecordEntry } from '../../src/domain/medical-record-entry/MedicalRecordEntry';
import { ICD11Code } from '../../src/domain/shared/ICD11Code';

describe("MedicalRecordEntry", () => {
    let icd11Code;
    let date;
    let medicalRecordEntry;

    beforeEach(() => {
        const codeResult = ICD11Code.create('1A00');
        if (!codeResult.isSuccess) {
            throw new Error("Failed to create ICD11Code: " + codeResult.errorValue());
        }
        icd11Code = codeResult.getValue();

        date = new Date();

        medicalRecordEntry = MedicalRecordEntry.create(icd11Code, date);
    }); 

    it("should create a MedicalRecordEntry instance using static create method", () => {
        expect(medicalRecordEntry.code).toEqual(icd11Code);
        expect(medicalRecordEntry.date).toEqual(date);
        expect(medicalRecordEntry.notMeaningfulAnyMore).toBe(false);
    });

    it("should create a MedicalRecordEntry instance with notMeaningfulAnyMore set to true", () => {
        const entry = MedicalRecordEntry.createWithNotMeaningfulAnyMore(icd11Code, date, true);
        
        expect(entry.code).toEqual(icd11Code);
        expect(entry.date).toEqual(date);
        expect(entry.notMeaningfulAnyMore).toBe(true);
    });

    it("should handle string conversion for notMeaningfulAnyMore", () => {
        const entryTrue = MedicalRecordEntry.createWithNotMeaningfulAnyMore(icd11Code, date, "true");
        const entryFalse = MedicalRecordEntry.createWithNotMeaningfulAnyMore(icd11Code, date, "false");

        expect(entryTrue.notMeaningfulAnyMore).toBe(true);
        expect(entryFalse.notMeaningfulAnyMore).toBe(false);
    });

    it("should toggle notMeaningfulAnyMore property", () => {
        const entry = MedicalRecordEntry.create(icd11Code, date);
    
        expect(entry.notMeaningfulAnyMore).toBe(false);
    
        const updatedEntry = entry.toggleNotMeaningfulAnyMore(true);
        expect(updatedEntry.notMeaningfulAnyMore).toBe(true);
        
        expect(entry.notMeaningfulAnyMore).toBe(false);
    });
    
    it("should update the date property", () => {
        const initialDate = new Date("2024-01-01");
        const updatedDate = new Date("2024-12-31");
        const entry = MedicalRecordEntry.create(icd11Code, initialDate);
    
        expect(entry.date).toEqual(initialDate);
    
        const updatedEntry = entry.updateDate(updatedDate);
        expect(updatedEntry.date).toEqual(updatedDate);
    
        expect(entry.date).toEqual(initialDate);
    });    

    it("should return a string representation of the MedicalRecordEntry", () => {
        const specificDate = new Date("2024-01-01T00:00:00.000Z");

        const entry = MedicalRecordEntry.create(icd11Code, specificDate);

        expect(entry.toString()).toBe("1A00_2024-01-01T00:00:00.000Z");
    });
});