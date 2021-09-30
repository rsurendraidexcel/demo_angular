import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-financials',
  templateUrl: './financials.component.html',
  styleUrls: ['./financials.component.scss']
})
export class FinancialsComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormGroup>();
  financialsForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.financialsForm = this.fb.group({
      ProcessFinancialManually: null,
      CalculateCurrentProfitLoss: null
    });
    this.formReady.emit(this.financialsForm);
  }
}
