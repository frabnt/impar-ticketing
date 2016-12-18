import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { TicketScanResultPage } from "./ticket-scan-result";
import { LogoComponent } from "../pages-components/logo-component/logo-component";
import { PopoverComponent } from "../pages-components/popover-component/popover-component";
import { SearchInfoComponent } from "../pages-components/search-info-component/search-info";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  App, MenuController,
  Platform, Config, Keyboard,
  IonicModule, NavParams,
  PopoverController, Form,
  DomController
}  from 'ionic-angular';

import { MockNavParams } from "../../mocks";
import { DebugElement } from "@angular/core";
import { OrderTransaction } from "../../models/order-transaction";
import { By } from "@angular/platform-browser";
/**
 * Created by francesco on 15/12/2016.
 */

describe('Pages: Ticket-scan-result', () => {

  let comp:    TicketScanResultPage;
  let fixture: ComponentFixture<TicketScanResultPage>;
  let ticket: OrderTransaction;

  beforeEach(async(() =>{
    TestBed.configureTestingModule({
      declarations: [
        TicketScanResultPage,
        LogoComponent,
        PopoverComponent,
        SearchInfoComponent
      ],
      providers: [
        App, Platform, Config, Form,
        PopoverController, Keyboard,
        DomController, MenuController,
        { provide: NavParams, useClass: MockNavParams },
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ],
    })
      .compileComponents().then(() => {
        spyOn(MockNavParams.prototype, 'get').and.callThrough();
        fixture = TestBed.createComponent(TicketScanResultPage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should select first table tabs', () => {
    expect(comp.tableTabs).toEqual('tableTab1');
  });

  it('should retrieve an OrderTransaction through nav params', () => {
    expect(MockNavParams.prototype.get).toHaveBeenCalledTimes(2);
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('dbString');
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('ticket');
    ticket = comp.orderTransaction;

    expect(ticket).toBeTruthy();
    expect(ticket.activated).toBe('2017-01-01 14:25:36');
    expect(ticket.barcodeId).toBe('%STGRP5GKZS');
    expect(ticket.credentialTypeId).toBe('cred-type-id');
    expect(ticket.deactivated).toBe('2017-03-01 15:34:57');
    expect(ticket.deactivationReason).toBe('deactivation-reason');
    expect(ticket.deleted).toBeNull();
    expect(ticket.identifier).toBe('identifier');
    expect(ticket.lastScanMode).toBeNull();
    expect(ticket.manifestId).toBe('manifest-id');
    expect(ticket.modified).toBeNull();
    expect(ticket.oneDay).toBeNull();
    expect(ticket.orderId).toBe('order-id');
    expect(ticket.scanStatus).toBe(0);
    expect(ticket.tokensGranted).toBe(-1);
    expect(ticket.tokensUsed).toBe(0);
    expect(ticket.transactionId).toBe('transaction-1');
    expect(ticket.transactionType).toBe('TICKET');
    expect(ticket.voided).toBe('2017-02-26 13:25:36');
  });

  it('should show the searched string', () => {
    fixture.detectChanges();
    let de: DebugElement = fixture.debugElement.query(By.css('search-info ion-row ion-col:last-child'));
    expect(de.nativeElement.textContent.trim()).toEqual('searched-string');
  });

  it('should map ticket properties in the view', () => {
    fixture.detectChanges();
    let de: DebugElement[] = fixture.debugElement.queryAll(By.css('ion-grid.table ion-row ion-col:last-child'));
    expect(de[0].nativeElement.textContent.trim()).toEqual(ticket.activated);
    expect(de[1].nativeElement.textContent.trim()).toEqual(ticket.barcodeId);
    expect(de[2].nativeElement.textContent.trim()).toEqual(ticket.credentialTypeId);
    expect(de[3].nativeElement.textContent.trim()).toEqual(ticket.deactivated);
    expect(de[4].nativeElement.textContent.trim()).toEqual(ticket.deactivationReason);
    expect(de[5].nativeElement.textContent.trim()).toEqual('empty');

    comp.tableTabs = 'tableTab2';
    fixture.detectChanges();
    de = fixture.debugElement.queryAll(By.css('ion-grid.table ion-row ion-col:last-child'));
    expect(de[0].nativeElement.textContent.trim()).toEqual(ticket.identifier);
    expect(de[1].nativeElement.textContent.trim()).toEqual('empty');
    expect(de[2].nativeElement.textContent.trim()).toEqual(ticket.manifestId);
    expect(de[3].nativeElement.textContent.trim()).toEqual('empty');
    expect(de[4].nativeElement.textContent.trim()).toEqual('empty');
    expect(de[5].nativeElement.textContent.trim()).toEqual(ticket.orderId);

    comp.tableTabs = 'tableTab3';
    fixture.detectChanges();
    de = fixture.debugElement.queryAll(By.css('ion-grid.table ion-row ion-col:last-child'));
    expect(de[0].nativeElement.textContent.trim()).toEqual(ticket.scanStatus.toString());
    expect(de[1].nativeElement.textContent.trim()).toEqual(ticket.tokensGranted.toString());
    expect(de[2].nativeElement.textContent.trim()).toEqual(ticket.tokensUsed.toString());
    expect(de[3].nativeElement.textContent.trim()).toEqual(ticket.transactionId);
    expect(de[4].nativeElement.textContent.trim()).toEqual(ticket.transactionType);
    expect(de[5].nativeElement.textContent.trim()).toEqual(ticket.voided);
  });

});
