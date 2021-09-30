import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';
import * as $  from 'jquery';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

@Component({
    selector : 'message-comp',
    templateUrl: '../../../app-common/component/message/message.html'
})
export class MessageServices {
    callbackName= '';
    private timer: Observable<any>;
    private subscription: Subscription;
    isShowYes = false;
    notificationMsgs = 'Success';
    @Output()
    sucessCallBack: EventEmitter<any> = new EventEmitter();
    constructor(private messageService: MessageService) {}

    addSingle(message: string, type: string) {
        this.clear();
        this.notificationMsgs = message;
        this.cync_notify(type, this.notificationMsgs,  8000);

    }
    alertMessage(message: string, type: string, delay: number) {
        this.clear();
        this.notificationMsgs = message;
        this.cync_notify(type, this.notificationMsgs,  delay);

    }

    clear() {
        this.messageService.clear();
    }

    showLoader(type: boolean){
        if (type){
         $('body').addClass('loading');
        }else{
            $('body').removeClass('loading');
        }

    }

    cync_notify(type, message, delay) {
         let timeout_notify;
         clearTimeout(timeout_notify);
         $('.master_notification').slideUp(0);
         $('#cync_notifications div').html(message);
         $('#cync_notifications div').removeAttr('class').attr('class', '');
         if (type == 'warning') { $('#cync_notifications div').addClass('warning'); }
         if (type == 'success') { $('#cync_notifications div').addClass('success'); }
         if (type == 'info') { $('#cync_notifications div').addClass('info');  }
         if (type == 'error') { $('#cync_notifications div').addClass('danger'); }
         if (type == 'danger') { $('#cync_notifications div').addClass('danger'); }

         $('.master_notification').slideDown('slow');
         let timeout;
         timeout_notify = setTimeout(function() {
                  $('.master_notification').slideUp('slow');
             }, delay);
    }

}

