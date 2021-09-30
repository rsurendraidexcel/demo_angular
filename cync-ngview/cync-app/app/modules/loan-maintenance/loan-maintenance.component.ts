import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: 'app-loan-maintenance',
	templateUrl: './loan-maintenance.component.html'
})
export class LoanMaintenanceComponent implements OnInit {

	constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {	}

	ngOnInit() {}

}