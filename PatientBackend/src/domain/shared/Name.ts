export class Name {
    private readonly value: string;

    constructor(value: string) {
        if (!value) {
            throw new Error("Name cannot be null or empty");
        }
        this.value = value;
    }

    public getValue(): string {
        return this.value;
    }
}