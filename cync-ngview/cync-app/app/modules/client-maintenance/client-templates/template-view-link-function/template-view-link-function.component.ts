import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
  selector: 'app-template-view-link-function',
  templateUrl: './template-view-link-function.component.html',
  styleUrls: ['./template-view-link-function.component.scss']
})
export class TemplateViewLinkFunctionComponent implements OnInit {
  data: any;
  params: any;
  viewPermissionValue: boolean = false;
  constructor(private router: Router,
              private message:MessageServices) { }

  ngOnInit() {
  }
  agInit(params:ICellRendererParams) {
    this.data = params.data;
    this.params = params;
    this.viewPermissionValue = this.params.context.clientTemplatesComponent.viewPermission;
  }

  onViewTemplate(params: any ) {
    this.router.navigate(['/client-maintenance/client-templates/client-parameters/' + this.data.id]);
  }

}
