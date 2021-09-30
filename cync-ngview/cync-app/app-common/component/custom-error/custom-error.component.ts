import { Component, OnInit } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CustomErrorService } from '@cyncCommon/component/custom-error/custom-error.service';


@Component({
  selector: 'custom-error-popup',
  templateUrl: './custom-error.component.html',
  styleUrls: ['./custom-error.component.scss']
})

export class CustomErrorComponent implements OnInit {

  assetsPath: string = CyncConstants.getAssetsPath();

  constructor(public oopService: CustomErrorService) {

  }

  ngOnInit() {   


  }

  reloadPage() {
    //this.ngOnInit();
    window.location.reload();
  }
}
