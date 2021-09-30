import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {

    if (this._router.url == '/financial') {
      this._router.navigateByUrl(this._router.url + "/financial-analyzer");
    }
  }

  selectedRadioBtn: string = 'finanical_statements';


  ngOnInit() {

  }

}
