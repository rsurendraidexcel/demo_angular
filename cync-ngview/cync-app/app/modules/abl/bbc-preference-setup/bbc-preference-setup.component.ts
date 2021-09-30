import { Component, OnInit } from '@angular/core';
import  {Router} from "@angular/router";


/*Commenting the particle JS code since its not using currently*/
//declare var particlesJS: any;

@Component({
  selector: 'app-bbc-preference-setup',
  templateUrl: './bbc-preference-setup.component.html',
  styleUrls: ['./bbc-preference-setup.component.css']
})
export class BbcPreferenceSetupComponent implements OnInit {

  constructor(private _router: Router){	
	if(this._router.url == '/bbc-preference-setup'){
		this._router.navigateByUrl(this._router.url+"/basic-parameters");
	}	
}

  ngOnInit() {

  /*Commenting the particle JS code since its not using currently*/
  //	particlesJS.load('particles-js', '../assets/particles.json', null);
  }

}
