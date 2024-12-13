export class ICD11Code {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    public getCode(): string {
        return this.value;
    }

    public setCode(value: string): void {
        this.value = value;
    }
}