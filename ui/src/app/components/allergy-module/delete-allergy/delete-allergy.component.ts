import {Component, EventEmitter, Input, Output, output} from '@angular/core';
import {Allergy} from '../../../models/allergy.model';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delete-allergy',
  templateUrl: './delete-allergy.component.html',
  standalone: true,
  styleUrl: './delete-allergy.component.css'
})
export class DeleteAllergyComponent {
  @Input() allergy!: Allergy;

  @Output() confirmDeleteEvent = new EventEmitter();
  @Output() closeDeleteEvent = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  accessToken: string = '';

  async ngOnInit() {
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

  confirmDelete() {
    this.confirmDeleteEvent.emit(this.allergy);
  }

  closeDelete() {
    this.closeDeleteEvent.emit();
  }
}
