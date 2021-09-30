import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CyncGridService {

  constructor(private cyncHttpService: CyncHttpService) { }

}
