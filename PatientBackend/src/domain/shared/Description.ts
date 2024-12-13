export class Description {
    private description: string;

    constructor(description: string) {
        this.description = description;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string): void {
        this.description = description;
    }
}