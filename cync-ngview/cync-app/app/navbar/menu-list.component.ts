import { Component, OnInit, Input } from '@angular/core';
import { navbarComponent } from '@app/navbar/navbar.component';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
	selector: 'menu-list',
	templateUrl: './menu-list.component.html'
})

export class MenuListComponent implements OnInit {

	@Input()
	level: number;

	@Input()
	menuList: any;


	columnClass: string;

	columnLevel: boolean = true;
	currentApplication: string;
	editForm: boolean;
	constructor(private _navbarComponent: navbarComponent, 
		private _helper: Helper) {
		this._helper.getEditForm().subscribe((d) =>  this.editForm = d);
	}

	ngOnInit() {
		this.currentApplication = 'angular';
	}

	navigateToMenu(event: any) {
		if(this.editForm === true) {
			this._helper.alertMessge();
		} else{
			this._navbarComponent.navigateToRor(event);
		}
	 
	}

	isRouterLinkRequired(subMenu : any){
        return subMenu.path.includes(this.currentApplication);
	}
	
}