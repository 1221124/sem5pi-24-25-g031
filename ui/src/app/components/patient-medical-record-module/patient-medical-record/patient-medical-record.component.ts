import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PatientMedicalRecord } from '../../../models/patient-medical-record.model';
import { CommonModule } from '@angular/common';
import { MedicalRecordEntry } from '../../../models/medical-record-entry';
import { MedicalConditionEntryFormComponent } from '../medical-condition-entry-form/medical-condition-entry-form.component';
import { PatientMedicalRecordService } from '../../../services/patient-medical-record/patient-medical-record.service';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { MedicalConditionService } from '../../../services/medical-condition/medical-condition.service';
import { FormsModule } from '@angular/forms';
import {Allergy} from '../../../models/allergy.model';
import {AllergyService} from '../../../services/allergy/allergy.service';
import {AllergyEntryFormComponent} from '../allergy-entry-form/allergy-entry-form.component';
import {DownloadHistoryFormComponent} from '../download-history-form/download-history-form.component';
import { response } from 'express';

@Component({
  selector: 'app-patient-medical-record',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MedicalConditionEntryFormComponent,
    AllergyEntryFormComponent,
    DownloadHistoryFormComponent,
  ],
  templateUrl: './patient-medical-record.component.html',
  styleUrls: ['./patient-medical-record.component.css'],
})
export class PatientMedicalRecordComponent implements OnInit {
  @Input() patient: Patient = {
    Id: '',
    FullName: {
      FirstName: '',
      LastName: '',
    },
    DateOfBirth: new Date(),
    Gender: '',
    MedicalRecordNumber: '',
    ContactInformation: {
      Email: '',
      PhoneNumber: 0,
    },
    EmergencyContact: 0,
    UserId: '',
  };
  @Output() close = new EventEmitter<void>();

  accessToken: string = '';

  patientMedicalRecord: PatientMedicalRecord = {
    Id: '',
    MedicalRecordNumber: '',
    Allergies: [],
    MedicalConditions: [],
  };
  medicalRecordLoaded = false;

  medicalConditionPopup = false;
  allergyPopup = false;
  downnloadHistoryPopup: boolean;

  medicalCondition: MedicalRecordEntry | null = null;
  allergy: MedicalRecordEntry | null = null;

  searchQueryMedicalCondition: string = '';
  searchQueryAllergy: string = '';

  filteredMedicalConditions: MedicalRecordEntry[] = [];
  filteredAllergies: MedicalRecordEntry[] = [];

  allMedicalConditions: MedicalCondition[] = [];
  medicalConditionsLoaded = false;

  allAlergies: Allergy[] = [];
  allergiesLoaded = false;

  isPatient = false;

  constructor(
    private service: PatientMedicalRecordService,
    private medicalConditionService: MedicalConditionService,
    private allergyService: AllergyService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    console.log('PatientMedicalRecordComponent initialized');
    if (!this.authService.isAuthWithRole(['Admin', 'Doctor', 'Patient'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
    this.isPatient = this.authService.isA('Patient');

    await this.getAllMedicalConditions();
    await this.getAllAllergies();
    await this.getPatientMedicalRecord();

    this.handleRoute();
  }

  private handleRoute() {
    if (this.router.url.includes('medical-condition')) {
      this.openMedicalConditionPopup();
    } else if (this.router.url.includes('allergy')) {
      this.openAllergyPopup();
    } else if (this.router.url.includes('download')) {
      this.openDownloadPopup();
    }
  }

  async getAllMedicalConditions() {
    try {
      if (this.allMedicalConditions.length === 0) {
        await this.medicalConditionService.get(this.accessToken).then(response => {
          if (response.status === 200 && response.body) {
            this.allMedicalConditions = response.body;
            this.medicalConditionsLoaded = true;
          } else {
            this.authService.updateMessage(
              'Error getting all medical conditions: ' + response.status
            );
            this.authService.updateIsError(true);
          }
        });
      }
    } catch (error) {
      this.authService.updateMessage(
        'Error getting all medical conditions: ' + error
      );
      this.authService.updateIsError(true);
    }
  }

  async getAllAllergies(){
    try {
      if (this.allAlergies.length === 0) {

        await this.allergyService.get(this.accessToken).then(response => {
          if (response.status === 200 && response.body) {
            this.allAlergies = response.body;
            this.allergiesLoaded = true;
          } else {
            this.authService.updateMessage(
              'Error getting all allergies: ' + response.status
            );
            this.authService.updateIsError(true);
          }
        });
      }
    } catch (error) {
      this.authService.updateMessage(
        'Error getting all allergies: ' + error
      );
      this.authService.updateIsError(true);
    }
  }

  async getPatientMedicalRecord() {
    try {
      const patient = await this.service.getPatientMedicalRecord(
        this.patient,
        this.accessToken
      );

      if (patient.status === 200 && patient.body) {
        this.patientMedicalRecord = patient.body.patientMedicalRecord;
        this.filteredMedicalConditions = [...this.patientMedicalRecord.MedicalConditions];
        this.filteredAllergies = [...this.patientMedicalRecord.Allergies];
        this.medicalRecordLoaded = true;
      } else {
        this.authService.updateMessage(
          'Error getting patient medical record: ' + patient.status
        );
        this.authService.updateIsError(true);
      }
    } catch (error) {
      this.authService.updateMessage(
        'Error getting patient medical record: ' + error
      );
      this.authService.updateIsError(true);
    }
  }


  getMedicalConditionName(ICD11Code: string) {
    while (!this.medicalConditionsLoaded) {
      setTimeout(() => {}, 100);
    }

    const medicalCondition = this.allMedicalConditions.find(
      (mc) => mc.code === ICD11Code
    );

    console.log('Medical Condition name:', medicalCondition.name);

    return medicalCondition.name;
  }

  getAllergyName(ICD11Code: string) {
    while (!this.allergiesLoaded) {
      setTimeout(() => {}, 100);
    }

    const allergy = this.allAlergies.find(
      (a) => a.code === ICD11Code
    );

    console.log('Allergy name:', allergy.name);

    return allergy.name;
  }

  searchMedicalConditions() {
    const query = this.searchQueryMedicalCondition.toLowerCase();

    this.filteredMedicalConditions = this.patientMedicalRecord.MedicalConditions.filter(
      (condition) =>
        condition.ICD11Code.toLowerCase().includes(query.toLowerCase()) ||
        this.allMedicalConditions.find((allergy) => allergy.code === condition.ICD11Code)?.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchAllergies() {
    const query = this.searchQueryAllergy.toLowerCase();

    this.filteredAllergies = this.patientMedicalRecord.Allergies.filter(
      (condition) =>
        condition.ICD11Code.toLowerCase().includes(query.toLowerCase()) ||
        this.allAlergies.find((medicalCondition) => medicalCondition.code === condition.ICD11Code)?.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  openMedicalConditionPopup(medicalCondition?: MedicalRecordEntry) {
    this.medicalCondition = medicalCondition || null;
    this.router.navigate(['/doctor/patients/patient-medical-record/medical-condition']);
    this.medicalConditionPopup = true;
  }

  closeMedicalConditionPopup() {
    this.getPatientMedicalRecord();
    this.medicalCondition = null;
    this.router.navigate(['/doctor/patients/patient-medical-record']);
    this.medicalConditionPopup = false;
  }

  closeAllergyPopup() {
    this.getPatientMedicalRecord();
    this.allergy = null;
    this.router.navigate(['/doctor/patients/patient-medical-record']);
    this.allergyPopup = false;
  }

  closePopup() {
    this.router.navigate(['/doctor/patients']);
    this.close.emit();
  }

  openAllergyPopup(allergyCondition?: MedicalRecordEntry) {
    this.allergy = allergyCondition || null;
    this.router.navigate(['/doctor/patients/patient-medical-record/allergy']);
    this.allergyPopup = true;
  }

  openDownloadPopup() {
    if (!this.router.url.includes('download')) {
      this.router.navigate(['/patient/patient-medical-record/download']);
    }
    this.downnloadHistoryPopup = true;
  }

  async downloadMedicalRecord() {
    if (!this.isPatient) return;

    await this.service.downloadPatientMedicalRecord(this.patientMedicalRecord.MedicalRecordNumber, this.accessToken)
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PatientMedicalRecord_${this.patientMedicalRecord.MedicalRecordNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error downloading PDF: ', error);
    })
    .finally(() => {
      setTimeout(() => {
        this.closeDownloadHistoryPopup();
      }, 2000);
    });
  }

  closeDownloadHistoryPopup() {
    this.router.navigate(['/patient/patient-medical-record']);
    this.downnloadHistoryPopup = false;
  }
}
