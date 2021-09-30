import { Component, OnInit, Renderer2 } from '@angular/core';
import { ClientTemplatesService } from "./service/client-templates.service";
import { Router } from '@angular/router';
import { TemplateViewLinkFunctionComponent } from './template-view-link-function/template-view-link-function.component';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MatDialog } from '@angular/material';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { GridOptions } from 'ag-grid-community';

@Component({
	selector: 'app-client-templates',
	templateUrl: './client-templates.component.html',
	styleUrls: ['./client-templates.component.scss'],
	providers: [ClientTemplatesService]
})
export class ClientTemplatesComponent implements OnInit {
	flag1: string;
	flag2: string;
	flag3: string;
	toggelbutton: string;
	gridApi1: any;
	partialData: any;
	clientTemplaterowData: any;
	disableAddButton = false;
	permissions: any = [];
	roleId: any;
	viewPermission: boolean = false;
	gridOptions: GridOptions;
	isDataLoaded: boolean = false;
	selectedTemplateId: any;
	isDisable: boolean = false;

	constructor(
		public dialog: MatDialog,
		private _helper: Helper,
		private _message: MessageServices,
		private clientTemplateDetails: ClientTemplatesService,
		private router: Router,
		private apiMapper: APIMapper,
		private renderer: Renderer2
	) {

	}

	ngOnInit() {
		this.gridOptions = {
			rowData: [],
			context: {
				clientTemplatesComponent: this
			}
		}
		this.setRolesandPermissions();
		this.getTemplateDetails();
		// desable clone, edit, and delete button on initial stage
		$('#cloneTemplateFaIcon').addClass('icon_disabled operation_disabled');
		$('#editTemplateFaIcon').addClass('icon_disabled operation_disabled');
		$('#deleteTemplateFaIcon').addClass('icon_disabled operation_disabled');
	}

	ngAfterViewInit() {
		const scrollElment = document.querySelector(".hscrollbar-tab");
		let h = $(self).height() - 350;
		scrollElment.addEventListener('scroll', ev => {
			h = $(self).height() - 350;
			this.renderer.setStyle(scrollElment, 'height', `${h}px`);
			this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
		});
		this.renderer.setStyle(scrollElment, 'height', `${h}px`);
		this.renderer.setStyle(scrollElment, 'overflow-y', 'scroll');
	}


	setRolesandPermissions() {
		this.roleId = localStorage.getItem('cyncUserRoleId');
		let url = this.apiMapper.endpoints[CyncConstants.CLIENT_TEMPLATE_ROLES_AND_PERMISSION].replace('{role_id}', this.roleId);
		this.clientTemplateDetails.getRolesandPermissions(url).subscribe(response => {
			this.permissions = JSON.parse(response._body);

			if (this.checkPermissionForMenu('create')) {
				$("#addTemplateFaIcon").css("display", "inline");
			} else {
				$("#addTemplateFaIcon").css("display", "none");
			}
			if (this.checkPermissionForMenu('update')) {
				$("#editTemplateFaIcon").css("display", "inline");
			} else {
				$("#editTemplateFaIcon").css("display", "none");
			}
			if (this.checkPermissionForMenu('destroy')) {
				$("#deleteTemplateFaIcon").css("display", "inline");
			} else {
				$("#deleteTemplateFaIcon").css("display", "none");
			}
			if (this.checkPermissionForMenu('copy_client_template')) {
				$("#cloneTemplateFaIcon").css("display", "inline");
			} else {
				$("#cloneTemplateFaIcon").css("display", "none");
			}
			this.viewPermission = this.checkPermissionForMenu('show');
			const tempViewPermission = this.viewPermission;
			localStorage.setItem('client_template_view_permission', tempViewPermission.toString());
			this.isDataLoaded = true;
		}, error => {
			this.isDataLoaded = true;
		});
	}

	getTemplateDetails() {
		this.clientTemplateDetails.gettemplatedetails('client_templates').subscribe(data => {
			this.partialData = <any>JSON.parse(data._body);
			this.clientTemplaterowData = this.partialData.data;
		});
	}

	// Template grid functions

	clienttemplateGridReady(params: any) {
		this.gridApi1 = params.api;
		params.api.sizeColumnsToFit();
	}


	clientTemplatecolumnDefs = [
		{
			headerName: 'Name',
			field: 'name',
			width: 270,
			sortable: true,
			filter: 'agTextColumnFilter',
			checkboxSelection: true,
			cellRendererFramework: TemplateViewLinkFunctionComponent,
		},
		{
			headerName: 'Description',
			field: 'description',
			width: 400,
			sortable: true
		},
		{
			headerName: 'Default', field: 'default', width: 200, sortable: true,
			cellRenderer: params => {
				return `<input type='radio' name='templateDefaultRadio' ${params.value ? 'checked' : ''} disabled />`;
			}
		},
		{
			headerName: 'Status', field: 'status', width: 200, sortable: true,
			cellRenderer: params => {
				return `<label class="switch">
      <input type="checkbox" name='templateDefaultRadio' ${params.value ? 'checked' : ''} disabled>
      <span class="slider round"></span>
    </label>`;
			}
		}
	];

	defaultColDef = {
		editable: false,
		filter: "agTextColumnFilter"
	}

	// on click add new template function
	onAddNewTemplate() {
		this.router.navigate(['/client-maintenance/client-templates/add-client-parameters']);
	}

	saveRowData() {
		if (confirm("Are you sure to Save Changes")) {
			$(".mainFormPanel").show();
			$(".radiobuttonBar").show();
			this.disableAddButton = false;
			var rowData = [];
			this.gridApi1.forEachNode(function (node) {
				rowData.push(node.data);
			});
			this.clientTemplaterowData.length = 0;
			this.clientTemplaterowData.push.apply(this.clientTemplaterowData, rowData);
		}
	}

	// Delete template function 
	onRemoveSelected() {

		const popupParam = {
			'title': 'Confirmation',
			message: CyncConstants.DELETE_TEMPLATE_CONFIRMATION,
			'msgType': 'warning'
		};
		this._helper.openConfirmPopup(popupParam).subscribe(result => {
			if (result) {
				this._message.showLoader(true);
				var selectedRowData = this.gridApi1.getSelectedRows();
				const deletedTemplateId = [];

				for (let i in selectedRowData) {
					deletedTemplateId.push(selectedRowData[i].id);

				}
				let deletedTemplateString = deletedTemplateId.toString();
				this.clientTemplateDetails.deleteTemplate('client_templates?ids=' + deletedTemplateString).subscribe(response => {

					this._helper.showApiMessages("Successfully Deleted", 'success');
					this.getTemplateDetails();
					this.gridApi1.refreshCells();
					this.selectedTemplateId = "";
					$('#deleteTemplateFaIcon').addClass('icon_disabled operation_disabled');
					$('#cloneTemplateFaIcon').addClass('icon_disabled operation_disabled');
					$('#editTemplateFaIcon').addClass('icon_disabled operation_disabled');
					this.isDisable = false;
					this._message.showLoader(false);
				});

			} else {
				return false;
			}
		});

	}

	// Template clone Method
	cloneTemplate() {
		var selectedRowData = this.gridApi1.getSelectedRows();
		var selectedTemplateForEdit = selectedRowData[0].id;
		var selectedTemplateDefault = selectedRowData[0].default;
		this.router.navigate(['/client-maintenance/client-templates/clone-client-parameters/' + selectedTemplateForEdit], { queryParams: { 'default': selectedTemplateDefault } })
	}

	// Template editing api handling

	onEditTemplate() {
		var selectedRowData = this.gridApi1.getSelectedRows();
		var selectedTemplateForEdit = selectedRowData[0].id;
		this.router.navigate(['/client-maintenance/client-templates/edit-client-parameters/' + selectedTemplateForEdit])
	}

	//Template row selection function

	onTemplateRowSelected(event) {
		if (event.node.selected) {
			this.selectedTemplateId = this.gridApi1.getSelectedNodes()[0].data.id;
		}

		$('#cloneTemplateFaIcon').removeClass('icon_disabled operation_disabled');
		$('#editTemplateFaIcon').removeClass('icon_disabled operation_disabled');
		$('#deleteTemplateFaIcon').addClass('icon_disabled operation_disabled');

		let selectedRowCount = this.gridApi1.getSelectedNodes().length;

		const selectTemplateActiveVal = []
		let selectedRowData = this.gridApi1.getSelectedRows();

		for (let i in selectedRowData) {
			selectTemplateActiveVal.push(selectedRowData[i].status)

		}
		if (selectTemplateActiveVal.includes(true)) {
			$('#deleteTemplateFaIcon').addClass('icon_disabled operation_disabled');
		}
		else {
			$('#deleteTemplateFaIcon').removeClass('icon_disabled operation_disabled');
		}

		if (selectedRowCount > 1) {
			//if more than one row select disable edit and clone button
			$('#cloneTemplateFaIcon').addClass('icon_disabled operation_disabled');
			$('#editTemplateFaIcon').addClass('icon_disabled operation_disabled');
			this.isDisable = true;
		}

		if (selectedRowCount == 1) {
			$('#cloneTemplateFaIcon').removeClass('icon_disabled operation_disabled');
			$('#editTemplateFaIcon').removeClass('icon_disabled operation_disabled');
			this.isDisable = false;
		}

		if (selectedRowCount == '') {
			$('#cloneTemplateFaIcon').addClass('icon_disabled operation_disabled');
			$('#editTemplateFaIcon').addClass('icon_disabled operation_disabled');
			$('#deleteTemplateFaIcon').addClass('icon_disabled operation_disabled');
			this.isDisable = false;
		}

		// disable template assign button if selected template is inactive
		if (selectedRowCount > 0 && selectedRowCount < 2) {
			let selectedRowStatus = this.gridApi1.getSelectedNodes()[0].data.status;

			if (selectedRowStatus === false || selectedRowStatus === null) {
		
				this.isDisable = true;
			}
			else {
			
				this.isDisable = false;
			}
		}

	}
	/**
   * to get permissions for role
   * @param menuName
   * @param actionType
   */
	checkPermissionForMenu(actionType: string): boolean {
		if (this.permissions.length > 0) {
			for (let i = 0; i < this.permissions.length; i++) {
				if (this.permissions[i].action == actionType) {
					return this.permissions[i].enabled;
				}
			}
		}
	}
	onClickAssign() {
		let selectedRowCount = this.gridApi1.getSelectedNodes().length;
		
		if (this.selectedTemplateId === undefined || this.selectedTemplateId === "" || selectedRowCount === 0) {
			this.router.navigate(['/client-maintenance/client-templates/multiple-client-assign/assigned']);
		}
		else {
			this.router.navigate(['/client-maintenance/client-templates/multiple-client-assign', this.selectedTemplateId]);
		}
	}

}
