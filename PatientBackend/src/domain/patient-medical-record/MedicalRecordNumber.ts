export class MedicalRecordNumber {
    private value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error("Medical record number cannot be null or empty");
        }
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }
}