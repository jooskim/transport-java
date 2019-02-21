/**
 * Copyright(c) VMware Inc. 2019
 */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractBase } from '@vmw/bifrost/core';
import { APIRequest, APIResponse, BusStore, StoreStream } from '@vmw/bifrost';
import { GeneralUtil } from '@vmw/bifrost/util/util';
import { ClrLoadingState } from '@clr/angular';
import { BaseBifrostComponent } from '../../../base.bifrost.component';
import { FabricConnectionState } from '@vmw/bifrost/fabric.api';

@Component({
    selector: 'galactic-request-sample',
    template: `
        <div class="clr-row" *ngIf="connected">
            <div class="clr-col-2">
                <button [clrLoading]="requestLoading" class="btn btn-primary-outline btn-sm" (click)="makeRequest()">Ask For A Joke</button>
            </div>
            <div class="clr-col-10" *ngIf="item">
                <blockquote>{{item}}</blockquote>
            </div>
        </div>
        <strong *ngIf="!connected">Not connected to fabric, connect to run this code</strong>`
})
export class GalacticRequestComponent extends BaseBifrostComponent implements OnInit, OnDestroy {

    public item: string;
    requestLoading: ClrLoadingState = ClrLoadingState.DEFAULT;

    constructor(private cd: ChangeDetectorRef) {
        super('GalacticRequestComponent');
    }

    ngOnInit(): void {
        super.ngOnInit();

        // make sure our component picks up connection state on boot.
        this.connectedStateStream.subscribe(
            () => {
                this.cd.detectChanges();
            }
        );
    }

    makeRequest(): void {

        // show state on the button
        this.requestLoading = ClrLoadingState.LOADING;

        // make galactic joke request!
        this.bus.requestGalactic(
            'servbot',
            new APIRequest('Joke', null, GeneralUtil.genUUID(), 1),
            (response: APIResponse<any>) => {
                this.item = response.payload;
                this.requestLoading = ClrLoadingState.DEFAULT;
                this.cd.detectChanges();
            }
        );
    }

    ngOnDestroy() {
       super.ngOnDestroy();
    }
}