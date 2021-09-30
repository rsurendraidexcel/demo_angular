import {Component, ViewEncapsulation} from '@angular/core';
import {ITooltipAngularComp} from "ag-grid-angular";

@Component({
    selector: 'tooltip-component',
    template: `
        <div class="custom-tooltip" [style.background-color]="data.color">
            <p>{{tooltipData}}</p>
        </div>`,


    styles: [
        `
            :host {
                position: absolute;
                width: 250px;
                height: 60px;
                border: 1px solid cornflowerblue;
                overflow: hidden;
                pointer-events: none;
                transition: opacity 1s;
            }

            :host.ag-tooltip-hiding {
                opacity: 0;
            }

            .custom-tooltip p {
                margin: 5px;
                white-space: nowrap;
            }
        `
    ],
    styleUrls: ['./custom-tooltip.component.scss']
})
export class CustomTooltip implements ITooltipAngularComp {

     params: any;
     data: any;
    tooltipData: any;
 
    agInit(params): void {
        console.log("params",params.value);
        this.params = params;
        this.tooltipData=params.value;
        this.data = params.api.getRowNode(params.rowIndex).data;
        this.data.color = this.params.color || 'white';
    }
}
