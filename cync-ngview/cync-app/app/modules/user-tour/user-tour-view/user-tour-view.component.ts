import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppConfig } from '@app/app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { GridOptions } from 'ag-grid-community';
import { UserTourService } from '../user-tour.service';
import { EditButtonComponent } from './edit-button.component';
declare var tinymce: any;

interface MenuList {
  screen_id: string;
  menu_hierarchy_name: string;
  user_email: string;
}

interface TourList {
  tour_id: string;
  screen_id: string;
  tour_help_titile: string;
  id: number;
  status: string;
}

@Component({
  selector: 'app-user-tour-view',
  templateUrl: './user-tour-view.component.html',
  styleUrls: ['./user-tour-view.component.scss']
})
export class UserTourViewComponent implements OnInit, AfterViewInit {
  gridApi: any;
  tourStepData: Array<any>;
  tourColumnDefs: any;
  tourDefaultColDef: any;
  tourGridOptions: GridOptions;
  tourFrameworkComponents: any;
  tourStepForm: FormGroup;
  menuHierarchy: MenuList[];
  selectedMenu: any;
  tourList: TourList[];
  tourStepPanel: boolean = false;
  helpTourPanel: boolean = false;
  tour_id: string;
  addMoreStep: boolean = false;
  tourSelectedActive: string;
  screen_id: string;
  tourNameTitle: string;
  buttonAction: string = "Add";
  updateTour_id: number;
  add_step: string = "single_step";
  editStep: string = "No";
  stepFormTtile: string;
  stepID: number;
  walkthroughtTitle: string;

  constructor( private config: AppConfig, public tour_service: UserTourService, private elm: ElementRef, public helper: Helper, private msgService: MessageServices, protected fb: FormBuilder) {
    this.tourStepData = [];
    this.tourList = [];
    this.tourFrameworkComponents = {
      'editButtonComponent': EditButtonComponent,
    };
    this.walkthroughtTitle = 'Add Walkthrough Title';

    this.tourDefaultColDef = {
      resizable: true,
      sortable: true,
      wrapText: true
    };
    this.tourGridOptions = <GridOptions>{
      floatingFilter: false,
      enableBrowserTooltips: true,
      paginationPageSize: 250,
      rowHeight: 35,
      rowSelection: "multiple",
      pagination: true,
      context: {
        tourComponent: this
      }
    };

    this.tourColumnDefs = [
      {
        headerName: 'Step No', field: 'step_no', sortable: true,
        with: 90
      },
      {
        headerName: 'Title', field: 'step_title', sortable: true
      },
      {
        headerName: 'Content Info', field: 'step_intro', sortable: true,
        width: 560,
        tooltipComponent: 'customTooltip',
      },
      {
        headerName: 'Selected Element', field: 'step_element', sortable: true,
        hide: true,
      },
      {
        headerName: 'Position', field: 'element_position', sortable: true,
        hide: true,
      },
      {
        headerName: 'Action', field: 'Action', sortable: true,
        cellRenderer: 'editButtonComponent',
        with: 148
      }
    ];

  }

  ngOnInit() {
    this.initializeSepForm();
    this.getMenuList();

  }

  ngAfterViewInit(): void {

  }


  initializeSepForm() {
    this.tourStepForm = this.fb.group({
      step_no: [''],
      step_title: [''],
      step_intro: [''],
      step_element: [''],
      element_position: [''],
    });

  }

  onSubmitStep() {
    if (this.tourStepForm.valid) {
      //let params = new URLSearchParams();
      let textarea_value = tinymce.get("step_intro").getContent();
      const payload = {
        'tour_id': `${this.tour_id}`,
        'step_title': `${this.tourStepForm.controls['step_title'].value}`,
        'step_intro': `${textarea_value}`,
        'step_element': `${this.tourStepForm.controls['step_element'].value}`,
        'element_position': `${this.tourStepForm.controls['element_position'].value}`
      };
      let url = 'tour-step';


      if (this.add_step === "single_step") {
        this.tour_service.postService(url, payload).subscribe(response => {
          console.log("===single===", this.tour_id, response);
          this.refreshTourList();
          this.cleanTourStepForm();
          this.textEditorRemove();
        });

      } else if (this.add_step === "more_step") {
        this.tour_service.postService(url, payload).subscribe(response => {
          console.log("===More===", this.tour_id, response);
          this.refreshStep(this.tour_id);
          this.cleanTourStepForm();
          this.textEditorRemove();
        });
      } else {
        console.log("===Nothings==");
      }

    }

  }

  cleanTourStepForm() {
    this.tourStepForm.controls['step_title'].setValue('');
    this.tourStepForm.controls['step_intro'].setValue('');
    this.tourStepForm.controls['step_element'].setValue('');
    this.tourStepForm.controls['element_position'].setValue('');
    this.tourStepPanel = false;
  }

  showTourStep(event: any, tourId: string) {
    $(event.target).parent().parent().find(".selected-tour-title").removeClass("selected-tour-title");
    $(event.target).parent().addClass("selected-tour-title");

    this.tour_id = tourId;
    let url = `tour-step?tour_id=${this.tour_id}`;
    if (this.tour_id) {
      this.tour_service.getService(url).subscribe(resData => {
        this.tourStepData = resData.data;
        if (this.tourStepData.length > 0) {
          this.addMoreStep = true;
        }
        console.log(this.tourStepData);
      });
    }
  }

  refreshStep(tourId: string) {
    this.tour_id = tourId;
    let url = `tour-step?tour_id=${this.tour_id}`;
    if (this.tour_id) {
      this.tour_service.getService(url).subscribe(resData => {
        this.tourStepData = resData.data;
        if (this.tourStepData.length > 0) {
          this.addMoreStep = true;
        }
        console.log(this.tourStepData);
      });
    }
  }

  refreshTourList() {
    this.getTourList(this.screen_id);
    this.tourStepData = [];
  }


  getMenuList() {
    let url = "menu-hierarchy";
    this.tour_service.getService(url).subscribe(resdata => {
      this.menuHierarchy = resdata.data as Array<MenuList>;
    });
  }

  onChangeMenuSelected(evt: any) {
    this.screen_id = this.selectedMenu.screen_id;
    let value = evt.value.screen_id;
    if (value) {
      this.screen_id = value;
      this.getTourList(value);
    } else {
      this.screen_id = "";
      this.tourList = [];
      this.tourStepData = [];
      this.addMoreStep = false;
      console.log("No Found Records");
    }
  }
  onDeleateTourTitle(tourId: string) {
    console.log("===Delete Fire====");
    let url = `tour-question/delete?tour_id=${tourId}`;
    if (tourId) {
      this.tour_service.delService(url).subscribe(respone => {
        console.log(respone);
        this.refreshTourList();
      });
    }

  }

  onAddNewTourTitle() {
    let url = "tour-question";
    if (this.screen_id && this.tourNameTitle) {
      let pbody = {
        screen_id: `${this.screen_id}`,
        tour_help_titile: `${this.tourNameTitle}`
      };
      this.tour_service.postService(url, pbody).subscribe(response => {
        console.log("Surcess", response);
        this.tourNameTitle = "";
        this.getTourList(this.screen_id);
      });

    } else {
      this.msgService.cync_notify("error", `Please, Fill the Walkthrough Title`, 3000);
    }

  }

  onOpenEditForm(id: number, tour_help_titile: string) {
    this.helpTourPanel = true;
    this.updateTour_id = id;
    this.walkthroughtTitle = "Edit Walkthrough Title";
    this.tourNameTitle = tour_help_titile;
    this.buttonAction = "edit";
  }

  onEditTourTitle() {
    this.helpTourPanel = false;
    let url = `tour-question/${this.updateTour_id}`;
    let payload = {
      tour_help_titile: `${this.tourNameTitle}`
    };
    if (this.updateTour_id && this.tourNameTitle) {
      this.tour_service.putService(url, payload).subscribe(resdata => {
        console.log(resdata);
        this.walkthroughtTitle = "Add Walkthrough Title";
        this.getTourList(this.screen_id);
      });
    }
  }

  onAddTourHelp() {
    this.helpTourPanel = true;
    this.tourStepPanel = false;
    this.tourNameTitle = "";
    this.buttonAction = "add";
  }

  onOpenTourStepForm(tourId: any) {
    this.stepFormTtile = "Add Step";
    this.tour_id = tourId;
    this.add_step = "single_step";
    this.editStep = 'No';
    this.helpTourPanel = false;
    this.tourStepPanel = true;
    setTimeout(() => {
      this.textEditorInitialize();
    }, 300);
  }
  onOpenAddMoreStepForm(tourId: any) {
    this.stepFormTtile = "Add more Step";
    this.tour_id = tourId;
    this.add_step = "more_step";
    this.editStep = 'No';
    this.helpTourPanel = false;
    this.tourStepPanel = true;
    setTimeout(() => {
      this.textEditorInitialize();
    }, 300);
  }

  onCancleStep() {
    this.tourStepPanel = false;
    this.textEditorRemove();
    this.cleanTourStepForm();
  }
  onCancleHelpTour() {
    this.helpTourPanel = false;
  }

  getTourList(screen_id: string) {
    let url = `tour-question?screen_id=${screen_id}`;
    this.tour_service.getService(url).subscribe(resdata => {
      this.tourList = resdata.data as TourList[];
      this.tourStepData = [];
      this.addMoreStep = false;
    });
  }

  onUpdateStep() {
    //let params = new URLSearchParams();
    let textarea_value = tinymce.get("step_intro").getContent();
    const payload = {
      'step_no': `${this.tourStepForm.controls['step_no'].value}`,
      'step_title': `${this.tourStepForm.controls['step_title'].value}`,
      'step_intro': `${textarea_value}`,
      'step_element': `${this.tourStepForm.controls['step_element'].value}`,
      'element_position': `${this.tourStepForm.controls['element_position'].value}`
    };
    let url = `tour-step/${this.stepID}`;
    this.tour_service.putService(url, payload).subscribe(response => {
      console.log("Step Edit is done");
      this.refreshStep(this.tour_id);
      this.tourStepPanel = false;
      this.tourStepForm.controls['step_no'].setValue('');
      this.cleanTourStepForm();
      this.textEditorRemove();
    });
  }

  // Child Compnent Trigger method 
  onOpenEditStepForm(data: any) {
    this.stepID = data.id;
    this.stepFormTtile = `Edit Step :: ${data.id} `;
    this.editStep = 'edit';
    this.helpTourPanel = false;
    this.tourStepPanel = true;
    this.tourStepForm.controls['step_no'].setValue(data.step_no);
    this.tourStepForm.controls['step_title'].setValue(data.step_title);
    this.tourStepForm.controls['step_intro'].setValue(data.step_intro);
    this.tourStepForm.controls['step_element'].setValue(data.step_element);
    this.tourStepForm.controls['element_position'].setValue(data.element_position);

    setTimeout(() => {
      this.textEditorInitialize();
      tinymce.get('step_intro').setContent(`${data.step_intro}`);
      tinymce.activeEditor.setContent(`${data.step_intro}`);
    }, 300);

  }

  deleteTourStep(data: any) {
    let url = `tour-step/${data.id}`;
    const popupParams = { 'title': 'confirmation', message: 'Are you sure you want to delete the step?' }
    this.helper.openConfirmPopup(popupParams).subscribe(result => {
      if (result) {
        this.tour_service.delService(url).subscribe(res => {
          console.log("deleate row", res);
          this.refreshStep(this.tour_id);
        });
      }

    }, (error) => {
      this.msgService.cync_notify("error", `${error.error}`, 3000);
    });

  }

  sizeToFit() {
    this.gridApi.sizeColumnsToFit();
    this.gridApi.refreshCells();
  }

  onTourGridReady(params: any) {
    this.gridApi = params.api;
    if(window.screen.width >= 1460)
      {
        this.sizeToFit();
      }
  }

  textEditorInitialize() {
    const textEditorElement = document.getElementById("step_intro");
    let thisObj = this;
    let local_url='../../assets/vendors/tinymce/skins/lightgray';
    let assets_url=`${window.origin}/angular/assets/vendors/tinymce/skins/lightgray`;
    tinymce.init({
      selector: 'textarea#step_intro',
      branding: false,
      plugins: ['link', 'paste', 'table', 'lists', 'image code', 'media', 'anchor'],
      height: "150",
      toolbar: 'undo redo | bold italic| bullist numlist | link image | code | media',
      images_upload_credentials: true,
      images_upload_handler: async (blobInfo, success, failure) => {
          let url = "upload";
          const fileInfo = {
            filename: `${blobInfo.filename()}`,
            mintype: `${blobInfo.blob().type}`
          };
          const filedata = blobInfo.blob();
          // Get S3 Secreate Path 
          const { url_path, file_name } =  await this.tour_service.putS3url(url,fileInfo);
          console.log("S3 scecret URL::", url_path);
          // Upload S3
           let result = await this.tour_service.uploadService(url_path, filedata).then(res => res);
           console.log("After upload ::", result);
           const imagePath=url_path.split('?')[0]; 
           
           const store_url='file-store';
           const payload={
             'file_name': `${file_name}`,
             'file_path': `${imagePath}`
           }

           this.tour_service.postService(store_url, payload).subscribe(resp => {
             console.log( resp);
            }, (error) => {
              console.log('Somithing Wrong',error);
           });

          return success(imagePath); 
      },
      video_template_callback: function(data) {
        return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source + '"' + (data.sourcemime ? ' type="' + data.sourcemime + '"' : '') + ' />\n' + (data.altsource ? '<source src="' + data.altsource + '"' + (data.altsourcemime ? ' type="' + data.altsourcemime + '"' : '') + ' />\n' : '') + '</video>';
      },
      skin_url: this.config.getEnvName()==='local' ? local_url: assets_url,
      menu: {
        edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
        format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
        tools: { title: 'Tools', items: 'spellchecker code' }
      }
    });

  }
 
  textEditorRemove() {
    tinymce.remove();
    tinymce.execCommand('mceRemoveControl', true, 'step_intro');
  }


}
