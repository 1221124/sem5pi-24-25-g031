import { Service } from 'typedi';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
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
            const doc = new PDFDocument();
            const fileName = `PatientMedicalRecord_${patientMedicalRecord.medicalRecordNumber.getValue()}.pdf`;

            // Write the PDF to the file system (you can change the location as needed)
            const filePath = `../../../${fileName}`;
            doc.pipe(fs.createWriteStream(filePath));

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

            // Return the file path where the PDF was saved
            return Result.ok<string>(filePath);

        } catch (error) {
            return Result.fail<string>(error.message);
        }
    }

}
