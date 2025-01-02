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
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
    
  }

  confirmDelete() {
    this.confirmDeleteEvent.emit(this.allergy);
  }

  closeDelete() {
    this.closeDeleteEvent.emit();
  }
}
