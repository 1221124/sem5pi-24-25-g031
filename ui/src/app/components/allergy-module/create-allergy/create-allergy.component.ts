import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Allergy} from '../../../models/allergy.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-allergy',
  templateUrl: './create-allergy.component.html',
  styleUrl: './create-allergy.component.css',
  standalone: true,
  imports: [
    FormsModule

  ],
})
export class CreateAllergyComponent {
  @Input() allergy!: Allergy;
  @Output() createNewAllergyEvent = new EventEmitter<Allergy>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
      private router: Router
  ){}

  accessToken: string = '';
  success: boolean = false;
  message: string = '';

  isProcessing: boolean = false;

  codeTouched: boolean = false;
  nameTouched: boolean = false;
  descriptionTouched: boolean = false;

  selectedAllergyCode: string = '';
  selectedAllergyName: string = '';
  selectedAllergyDescription: string = '';

  async ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      await this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not an admin! Redirecting to login...');
      this.authService.updateIsError(true);
      await this.router.navigate(['']);
      return;
    }
  }

  submit () {
    if(this.isProcessing){
      return;
    }

    this.isProcessing = true;

    if (!this.selectedAllergyCode || !this.selectedAllergyName || !this.selectedAllergyDescription) {
      this.isProcessing = false;
      this.message = 'All fields are required!';
      this.success = false;
      return;
    }

    this.allergy.code = this.selectedAllergyCode;
    this.allergy.name = this.selectedAllergyName;
    this.allergy.description = this.selectedAllergyDescription;

    this.createNewAllergyEvent.emit(this.allergy);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        code: this.allergy.code,
        name: this.allergy.name,
        description: this.allergy.description
      },
      queryParamsHandling: 'merge'
    });

    setTimeout(() => {
      this.isProcessing = false;
    }, 5000);
  }

  emitCloseModalEvent() {
    this.closeModalEvent.emit();
  }

  protected readonly name = name;
}
