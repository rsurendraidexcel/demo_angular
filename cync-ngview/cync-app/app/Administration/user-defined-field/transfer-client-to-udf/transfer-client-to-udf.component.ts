import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Helper } from '@cyncCommon/utils/helper';

@Component({
    selector: 'app-transfer-client-to-udf',
    templateUrl: './transfer-client-to-udf.component.html',
    styleUrls: ['./transfer-client-to-udf.component.scss']
})
export class TransferClientToUdfComponent implements OnInit {

    key = 'id';
    display = 'name';
    source = [];
    target = [];
    filter = true;

    constructor(private _helper: Helper) { }

    ngOnInit() {
        this._helper.adjustUI();
    }
}
