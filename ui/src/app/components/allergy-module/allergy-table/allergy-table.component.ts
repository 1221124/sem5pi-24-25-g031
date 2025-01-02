import {Component, EventEmitter, Input, output, Output, SimpleChange} from '@angular/core';
import {Allergy} from '../../../models/allergy.model';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-allergy-table',
  templateUrl: './allergy-table.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrl: './allergy-table.component.css'
})
export class AllergyTableComponent {
  @Input() allergies: Allergy[];
  @Input() displayAllergies: Allergy[] = [];

  @Output() filterAllergiesEvent = new EventEmitter<{ code?: string; name?: string; description?: string }>();
  @Output() updateAllergyEvent = new EventEmitter<Allergy>();
  @Output() deleteAllergyEvent = new EventEmitter<Allergy>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  accessToken: string = '';

  message: string = '';
  success: boolean = false;

  pages = {
    currentPage: 1,
    totalPages: 1
  };

  filter = {
    searchCode: '',
    searchName: '',
    searchDescription: ''
  };

  async ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
    
    console.log('ALLERGIES:', this.allergies);

    if (!this.allergies) {
      this.allergies = [];
    }

    this.displayAllergies = [];
    console.log('DISPLAY ALLERGIES:', this.displayAllergies);

    this.pages.currentPage = 1;
    this.pages.totalPages = Math.ceil(this.allergies.length / 2);
    this.changePage(this.pages.currentPage);

  }

  changePage(page: number) {
    this.pages.currentPage = page;
    this.displayAllergies = this.allergies.slice((page - 1) * 2, page * 2);
  }


  filterAllergies() {
    const filters = {
      code: this.filter.searchCode,
      name: this.filter.searchName,
      description: this.filter.searchDescription
    };

    if (this.displayAllergies.length !== 0) {
      this.pages.currentPage = 1;
      this.pages.totalPages = Math.ceil(this.displayAllergies.length / 2);
      this.changePage(this.pages.currentPage);
    }
    this.filterAllergiesEvent.emit(filters);
  }

  clearFilters() {
    this.filter = {
      searchCode: '',
      searchName: '',
      searchDescription: ''
    }

    this.pages.currentPage = 1;
    this.pages.totalPages = Math.ceil(this.allergies.length / 2);
    this.changePage(this.pages.currentPage);


    this.filterAllergiesEvent.emit({});
  }
}
