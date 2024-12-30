import { Service } from 'typedi';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import path from 'path';
import { Result } from "../core/logic/Result";
import IFileService from './IServices/IFileService';
import { PatientMedicalRecordDto } from '../dto/patient-medical-record/PatientMedicalRecordDto';

@Service()
export default class FileService implements IFileService {

    constructor(
    ) {}

    /**
     * Creates a PDF File for a Patient Medical Record.
     * @param patientMedicalRecord 
     */
    public async createFile(patientMedicalRecord: PatientMedicalRecordDto): Promise<Result<string>> {
        try {
            console.log('Creating PDF File for Patient Medical Record...');
            const doc = new PDFDocument();
            const fileName = `PatientMedicalRecord_${patientMedicalRecord.medicalRecordNumber.getValue()}.pdf`;

            console.log('File Name: ', fileName);

            // Write the PDF to the file system (you can change the location as needed)
            const filePath = path.join(__dirname, '../../../files', fileName);
            console.log('File Path: ', filePath);

            if (!fs.existsSync(path.dirname(filePath))) {
                fs.mkdirSync(path.dirname(filePath), { recursive: true });
            }

            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Add Title
            doc.fontSize(20).text('PATIENT MEDICAL RECORD', { align: 'center' });

            // Add Medical Record Number and Date
            const currentDate = new Date().toLocaleString();
            doc.fontSize(12).text(`\nMedical Record Number: ${patientMedicalRecord.medicalRecordNumber.getValue()}`);
            doc.text(`Generated at: ${currentDate}\n`);

            // Add Allergies Section
            doc.text('Allergies:', { underline: true });
            doc.text('Name and ICD11Code | Last Updated at (Date) | Not Meaningful Anymore\n');
            patientMedicalRecord.allergies.forEach(allergy => {
                doc.text(`${allergy.code.toString()} | ${allergy.date.toLocaleDateString()} | ${allergy.notMeaningfulAnyMore ? 'Yes' : 'No'}`);
            });

            // Add Medical Conditions Section
            doc.text('\nMedical Conditions:', { underline: true });
            doc.text('Name and ICD11Code | Last Updated at (Date) | Not Meaningful Anymore\n');
            patientMedicalRecord.medicalConditions.forEach(condition => {
                doc.text(`${condition.code.toString()} | ${condition.date.toLocaleDateString()} | ${condition.notMeaningfulAnyMore ? 'Yes' : 'No'}`);
            });

            // Add Footer
            doc.text('\n\n\nSARM G031', { align: 'center' });

            // Finalize the PDF and save it
            doc.end();

            await new Promise<void>((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            console.log('PDF File created successfully!');

            // Return the file path where the PDF was saved
            return Result.ok<string>(filePath);

        } catch (error) {
            console.error('Error creating PDF File: ', error);
            return Result.fail<string>(error.message);
        }
    }

}
