import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MedicalRecordEntry} from '../../../models/medical-record-entry';
import {MedicalConditionService} from '../../../services/medical-condition/medical-condition.service';
import {AllergyService} from '../../../services/allergy/allergy.service';
import {PatientMedicalRecord} from '../../../models/patient-medical-record.model';
import {PatientMedicalRecordService} from '../../../services/patient-medical-record/patient-medical-record.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-allergy-entry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './allergy-entry-form.component.html',
  styleUrl: './allergy-entry-form.component.css'
})
export class AllergyEntryFormComponent {
  isEdit = undefined;

  newAllergy: MedicalRecordEntry = {
    ICD11Code: '',
    Date: new Date(),
    notMeaningfulAnymore: false
  };

  @Input() patientMedicalRecord: PatientMedicalRecord = {
    Id: '',
    MedicalRecordNumber: '',
    Allergies: [],
    MedicalConditions: []
  }

  @Input() allergy: MedicalRecordEntry = {
    ICD11Code: '',
    Date: new Date(),
    notMeaningfulAnymore: false
  };

  @Output() closeAllergy = new EventEmitter<void>();
  @Output() closeDownload = new EventEmitter<void>();

  accessToken: string = '';

  message: string = '';
  isError: boolean = false;

  constructor(
    private service: PatientMedicalRecordService,
    private authService: AuthService,
    private allergyService: AllergyService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.authService.isAuthWithRole(['Doctor'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

    if (this.allergy) {
      if (this.allergy.ICD11Code) {
        this.isEdit = true;
        this.allergy = { ...this.allergy };
      }
    } else {
      this.isEdit = false;
    }

    if (!this.patientMedicalRecord.Id) {
      this.message = 'Patient medical record not found';
      this.isError = true;
      this.closeAllergy.emit();
    }
  }

  async  validateICD11Code(code: string) {
    try {
      if (!code || code === '') {
        this.message = 'ICD11 code cannot be empty';
        this.isError = true;
        return;
      }
      let isValid = await this.allergyService.validateICD11Code(code, this.accessToken);

      console.log(isValid);

      if (!this.isEdit) {
        isValid = isValid && this.patientMedicalRecord.Allergies.findIndex((mc) => mc.ICD11Code === code) === -1;
        if (!isValid) {
          this.message = 'ICD11 code already exists in patient medical record';
          this.isError = true;
          return;
        }
      }

      if (isValid) {
        this.message = 'ICD11 code is valid';
        this.isError = false;
      } else {
        this.message = 'ICD11 code is invalid';
        this.isError = true;
      }
    } catch (error) {
      this.message = 'Error validating ICD11 code';
      this.isError = true;
    }
  }

  async saveAllergy() {
    try {
      console.log("Entrou");
      const response = await this.service.saveAllergy(this.patientMedicalRecord.Id, this.newAllergy, this.accessToken);
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        this.message = 'Allergy saved successfully';
        this.isError = false;
      }
    } catch {
      this.message = 'Error saving allergy';
      this.isError = true;
    } finally {
      this.closeAllergy.emit();
    }
  }
}
