import { Component, OnInit, Input } from '@angular/core';

import {MenuColumnModel} from './menu-columns-model';
@Component({
    selector: 'sub-menu',
    templateUrl: './sub-menu.component.html'
})

export class SubMenuComponent implements OnInit {

  	@Input()
  	menuList : any;

  	isMenuColumnArrayCalculated : boolean = false;

  	menuColumnModelArray : MenuColumnModel[] = [];

  	maxMenuItems : number = 20;

  	subMenuWidth : number = 450;

	constructor(){

	}

	ngOnInit(){
		let menuItemCountMap = this.populateMenuItemCount();
		let menuColumnCountMap = this.populateMenuColumnsArrayMap(menuItemCountMap);
		let arrMenuColumnModel = this.populateMenuColumnWidthMap(menuColumnCountMap);
		this.getTotalContainerWidth(arrMenuColumnModel);
		this.menuColumnModelArray = arrMenuColumnModel;
	}

	ngOnChanges(){
		let menuItemCountMap = this.populateMenuItemCount();
		let menuColumnCountMap = this.populateMenuColumnsArrayMap(menuItemCountMap);
		let arrMenuColumnModel = this.populateMenuColumnWidthMap(menuColumnCountMap);
		this.getTotalContainerWidth(arrMenuColumnModel);
		this.menuColumnModelArray = arrMenuColumnModel;
	}


	getTotalMenuNamesInMenu(menuArr : any, arrMenuNames : any[]) : any[]{

		arrMenuNames.push(menuArr.menu_name);
		if(menuArr.sub_menu_list.length>0){
			for(let i=0; i < menuArr.sub_menu_list.length ; i++){
				this.getTotalMenuNamesInMenu(menuArr.sub_menu_list[i], arrMenuNames);
			}
		}
		
		return arrMenuNames;
	}

	populateMenuItemCount() : Map<any[], number>{


		let menuCountMap : Map<any[], number> = new Map<any[], number>();

		for(let i =0 ; i < this.menuList.length;i++){
			let tempArr = [];
			let menuNamesArr = this.getTotalMenuNamesInMenu(this.menuList[i],tempArr);
			menuCountMap.set(this.menuList[i],menuNamesArr.length);
		}
		
		return menuCountMap;
	}

	populateMenuColumnsArrayMap(menuCountMap : Map<any[], number>) : Map<any[], number>{
		
		let menuColumns = [];
		let entriesOriginal = Array.from(menuCountMap.entries());
		let entries = entriesOriginal.reverse();
		let menuColumnsCountMap : Map<any[], number> = new Map<any[], number>();
		let i =  entries.length-1;
		while(i>=0){
			let entry = entries[i];
			let arrSubMenus = [];
			arrSubMenus.push(entry[0]);
			let count = entry[1];
			entries.splice(i,1);
			var j = entries.length;
			while(j--){
				let subEntry = entries[j];
				if(count+subEntry[1]<=this.maxMenuItems){
					count = count + subEntry[1];
					arrSubMenus.push(subEntry[0]);
					entries.splice(j,1);
				}else{
					break;
				}
			}
			i =  entries.length-1;
			menuColumns.push(arrSubMenus);
			menuColumnsCountMap.set(menuColumns,count);
		}
		
		return menuColumnsCountMap;
	}

	getMenuWidth(menu: any, width : number) : number{
		
		let menuName = menu.menu_name;
		let widthNew = menuName.length;
		if(widthNew > width){
			width = widthNew;
		}
		if(menu.sub_menu_list.length>0){
			for(let i =0 ; i < menu.sub_menu_list.length; i++){
				width = this.getMenuWidth(menu.sub_menu_list[i], width);
			}
			
		}

		return width;
	}

	populateMenuColumnWidthMap(menuColumnCountMap : Map<any[], number>) : MenuColumnModel[]{
		
		let menuColumns = Array.from(menuColumnCountMap.keys())[0];
		let arrMenuColumnModels : MenuColumnModel[] = []; 
		
		for(let i =0; i < menuColumns.length; i++){
			let width = 0;
			let chunkLength = menuColumns[i].length;

			for(let k=0; k < menuColumns[i].length; k++){
				let menu = menuColumns[i][k];
				
				let menuWidth = this.getMenuWidth(menu,width);
				if(menuWidth>width){
					width = menuWidth;
				}
			}
			let menuColumnModel = new MenuColumnModel();
			menuColumnModel.column = menuColumns[i];
			menuColumnModel.width = width;
			arrMenuColumnModels.push(menuColumnModel);

		}

		this.isMenuColumnArrayCalculated = true;


		return arrMenuColumnModels;
	}

	getTotalContainerWidth(chunksArr : MenuColumnModel[]) : number{
		let width = 0;
		
		for(let i=0;i<chunksArr.length;i++){
			width = ((chunksArr[i].width*7)+20) + width;
		}

		width = width+255;
		document.getElementById("primary_menu_container").style.width = width+"px";

		return width;

	}


}