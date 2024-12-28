import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model, Schema } from 'mongoose';
import { Document } from 'mongoose';
import { IPatientMedicalRecordPersistence } from '../src/dataschema/IPatientMedicalRecordPersistence';
import PatientMedicalRecordRepo from '../src/repos/PatientMedicalRecordRepo';

export class TestRepoFactory {
    private static mongoServer: MongoMemoryServer;

    static async start() {
        this.mongoServer = await MongoMemoryServer.create();
        const mongoUri = this.mongoServer.getUri();
        await mongoose.connect(mongoUri);
    }

    static async stop() {
        await mongoose.disconnect();
        await this.mongoServer.stop();
    }

    static createPatientMedicalRecordRepo(): PatientMedicalRecordRepo {
        const schema = new Schema<IPatientMedicalRecordPersistence & Document>({});
        const model = mongoose.model<IPatientMedicalRecordPersistence & Document>('PatientMedicalRecord', schema);
        return new PatientMedicalRecordRepo(model);
    }
}