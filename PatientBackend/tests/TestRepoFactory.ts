import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model, Schema } from 'mongoose';
import { Document } from 'mongoose';
import { IPatientMedicalRecordPersistence } from '../src/dataschema/IPatientMedicalRecordPersistence';
import PatientMedicalRecordRepo from '../src/repos/PatientMedicalRecordRepo';
import AllergyRepo from "../src/repos/AllergyRepo";
import {IAllergyPersistence} from "../src/dataschema/IAllergyPersistence";
import MedicalConditionRepo from '../src/repos/MedicalConditionRepo';
import { IMedicalConditionPersistence } from '../src/dataschema/IMedicalConditionPersistence';

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

    static createAllergyRepo(): AllergyRepo {
        const schema = new Schema<IPatientMedicalRecordPersistence & Document>({});
        const model = mongoose.model<IAllergyPersistence & Document>('Allergy', schema);
        return new AllergyRepo(model);
    }

    static createMedicalConditionRepo(): MedicalConditionRepo {
        const schema = new Schema<IMedicalConditionPersistence & Document>({});
        const model = mongoose.model<IMedicalConditionPersistence & Document>('MedicalCondition', schema);
        return new MedicalConditionRepo(model);
    }
}