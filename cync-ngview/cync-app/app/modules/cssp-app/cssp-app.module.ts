import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppcsspComponent } from './cssp-app.component';
import { CommonModule } from '@angular/common';

import { FormValidationService } from './service/form-validation.service';
import { JiraServiceDeskapiService } from './service/jira-service-deskapi.service';
import { ControlMessagesComponent } from './service/control-messages.component';
import { SetClassDirective } from './directive/set-class.directive';
import { SearchPipePipe } from './pipe/search-pipe.pipe';
import { FormatTextPipePipe } from './pipe/format-text-pipe.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { GetUsernamePipe } from './pipe/get-username.pipe';
import { DatePipePipe } from './pipe/date-pipe.pipe';
import { HttpClientModule } from '@angular/common/http';
import { CsspappRoutingModule } from './cssp-app-routing.module';

import { MultiSelectModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    AppcsspComponent,
    ControlMessagesComponent,
    SetClassDirective,
    SearchPipePipe,
    FormatTextPipePipe,
    GetUsernamePipe,
    DatePipePipe   
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CsspappRoutingModule,
    InfiniteScrollModule,
    MultiSelectModule
  ],
  providers: [FormValidationService, JiraServiceDeskapiService ]
})
export class AppcsspModule { }
