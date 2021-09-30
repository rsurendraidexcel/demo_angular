import { Component, ElementRef, ViewChild } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'delete-button',
    template: `<img class="delete-icon" (click)="onDelete()" src="assets/images/icons/trash.png" alt="Delate" title="Delete">`,
    styles: [`
    .delete-icon {
        height: 13px;
        margin-left: 5px;
        cursor: pointer;
    }
    `
    ]
})

export class DeleteButtonComponent implements ICellRendererAngularComp {

    public params: ICellRendererParams;
    constructor() { }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    /**
    * Delete button click event
    */
    onDelete() {
        this.params.context.componentParent.deleteWebhook(this.params); 
    }
}