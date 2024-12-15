import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sucess-modal-staffs',
  templateUrl: './sucess-modal-staffs.component.html',
  standalone: true,
  imports: [NgIf],
  styleUrl: './sucess-modal-staffs.component.css'
})
export class SucessModalStaffsComponent {
  @Input() success: boolean = false;
  @Input() message: string | null = null;

}
