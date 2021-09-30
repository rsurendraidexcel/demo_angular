import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'factong-maintenace',
  templateUrl: './maintenance.componet.html',
  styleUrls: ['./maintenance.componet.scss']
})
export class MaintenaceComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

  }
  ngOnInit() {

  }

}
