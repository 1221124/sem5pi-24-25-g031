import { Component, OnInit } from '@angular/core';
import { OperationTypeService, OperationType } from '../../services/operationTypes.service';

@Component({
  selector: 'app-operationTypes',
  templateUrl: './operationTypes.component.html',
  styleUrls: ['./operationTypes.component.css']
})
export class OperationTypesComponent implements OnInit {
  operationTypes: OperationType[] = [];

  constructor(private operationTypeService: OperationTypeService) { }

  ngOnInit(): void {
    this.loadOperationTypes();
  }

  loadOperationTypes(): void {
    this.operationTypeService.getOperationTypes().subscribe(data => {
      this.operationTypes = data;
    });
  }
}
