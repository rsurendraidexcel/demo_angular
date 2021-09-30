import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.scss']
})
export class ProcessingComponent implements OnInit {

  constructor(
    private router: Router, private activatedRoute: ActivatedRoute
  ) { 
    
  console.log("[Proccession Module load]");

  }

  ngOnInit() {
  }

}
