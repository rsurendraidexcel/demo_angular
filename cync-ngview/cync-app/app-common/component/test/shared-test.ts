import { Component, OnInit, Input, ElementRef, ViewChild, HostListener, NgZone, OnDestroy, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class MockActivatedRoute {
    params: Observable<any> = Observable.of({});
}

export class MockRouter {
    navigateByUrl(url: string) { return url; }
}

export class ServiceSpy {
    public static spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy: any, body: any){
        const data = {
            _body: JSON.stringify(body)
        };

        cyncHttpServiceSpy.and.returnValue(Observable.of(data));
    }

    public static spyCompServiceAndReturnDataForMock(componentServiceSpy: any, data: any){
        componentServiceSpy.and.callFake(() => {
			return Observable.of(data);
		});
    }
}