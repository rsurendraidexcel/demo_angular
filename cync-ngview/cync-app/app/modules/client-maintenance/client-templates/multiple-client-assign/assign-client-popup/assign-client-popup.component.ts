import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogData } from '@app/modules/factoring/brokers/broker-commission/sub-component/broker-commission-detail/broker-commission-detail.component';

@Component({
	selector: 'app-assign-client-popup',
	templateUrl: './assign-client-popup.component.html',
	styleUrls: ['./assign-client-popup.component.scss']
})
export class AssignClientPopupComponent implements OnInit {
	assignData = {assign:"", fname:"", fdesc:""}
	isDisableConfirm: boolean = true;

	constructor(
		public dialogRef: MatDialogRef<AssignClientPopupComponent>,  @Inject(MAT_DIALOG_DATA) public data: DialogData
	) { 
	}

	ngOnInit() {
		
	}

	notUpdateTemplate(event: any) {
		if (event.type === "click") {
			this.isDisableConfirm = false;
			$("#template").css("display", "none");
		}
	}

	updateTemplate(event: any) {
		if (event.type === "click") {
			this.isDisableConfirm = false;
			$("#template").css("display", "none");
		}
	}

	createCopyTemplate(event: any) {
		if (event.type === "click") {
			this.isDisableConfirm = false;
			$("#template").css("display", "block");
		}
	}

	onCancelClicked()
	{
		this.dialogRef.close();
	}

	onConfrimClick(){
		
	}
	
	isDisableConfirmMethod(){
		if(this.assignData.assign == 'copy'){
			let templetName = (this.assignData.fname).trim();
			if(templetName == null || templetName == '' || templetName == undefined){
				return true;
			}else{
				return false;
			}
		}else {
			return this.isDisableConfirm;
		}
	}

}
