import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-factoring',
  templateUrl: './factoring.component.html',
  styleUrls: ['./factoring.component.scss']
})
export class FactoringComponent implements OnInit {

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {

  }

}
