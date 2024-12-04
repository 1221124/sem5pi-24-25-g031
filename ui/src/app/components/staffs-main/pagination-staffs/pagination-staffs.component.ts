import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-pagination-staffs',
  templateUrl: './pagination-staffs.component.html',
  styleUrl: './pagination-staffs.component.css'
})
export class PaginationStaffsComponent {

  @Input() filter = {
    pageNumber: 1,
    name: '',
    email: '',
    specialization: ''
  }
  @Input() totalPages: number = 1;


  @Output() pageChanged: EventEmitter<number> = new EventEmitter<number>(); // Evento para emitir a página alterada

// Atualiza a página atual para a nova página selecionada
  async changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.pageChanged.emit(pageNumber);
    }
  }
}
