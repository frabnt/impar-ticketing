import { ScanPage } from "./scan";
import { ComponentFixture, async, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { LogoComponent } from "../pages-components/logo-component/logo-component";
import { LogoutComponent } from "../pages-components/logout-component/logout-component";

import {
  App, Config, Keyboard, DomController, MenuController, Platform, AlertController,
  IonicModule, Form
} from "ionic-angular";

import { MockPlatform, MockAlertController, MockLoading, MockNavController } from "../../mocks";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { MockExecTimeService } from "../../services/exec-time/mock-exec-time-service";
import { SpinnerService } from "../../services/utils/spinner-service";
import { MockSpinnerService } from "../../services/utils/mock-spinner-service";
import { DatabaseService } from "../../services/database/database-service";
import { MockDatabaseService } from "../../services/database/mock-database-service";
import { FormBuilder, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
import { MockVfsApiService } from "../../services/vfs-api/mock-vfs-api-service";
import { ScanResult } from "../../models/scan-result";
import { ScanResultPage } from "../scan-result-tabs/scan-result-tabs";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
/**
 * Created by francesco on 21/12/2016.
 */

describe('Pages: Scan', () => {

  let comp:    ScanPage;
  let fixture: ComponentFixture<ScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScanPage,
        LogoComponent,
        LogoutComponent
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        App, Config, Keyboard, FormBuilder,
        DomController, MenuController, Form,
        { provide: VfsApiService, useClass: MockVfsApiService },
        { provide: Platform, useClass: MockPlatform },
        { provide: ExecTimeService, useClass: MockExecTimeService },
        { provide: AlertController, useClass: MockAlertController },
        { provide: SpinnerService, useClass: MockSpinnerService },
        { provide: DatabaseService, useClass: MockDatabaseService },
      ]
    })
      .compileComponents().then(() => {
      spyOn(MockExecTimeService.prototype, 'getTime').and.callThrough();

      fixture = TestBed.createComponent(ScanPage);
      comp = fixture.componentInstance;

      fixture.detectChanges();
    });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  describe('should set random credentials and tickets', () => {

    beforeEach(() => {
      spyOn(MockDatabaseService.prototype, 'openDatabase').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'selectRandomCredentials').and.callThrough();
    });

    it('should open the database and retrieve random credentials and tickets', fakeAsync(() => {
      spyOn(MockDatabaseService.prototype, 'selectRandomTickets').and.callThrough();

      comp.ngOnInit();
      tick();

      expect(MockDatabaseService.prototype.openDatabase).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.selectRandomTickets).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.selectRandomCredentials).toHaveBeenCalledTimes(1);

      expect(comp.randomCredentials).toEqual(['credential-1', 'credential-2']);
      expect(comp.randomTickets).toEqual(['ticket-1', 'ticket-2']);
    }));

    it('should show an error message if a db operation fail', fakeAsync(() => {
      spyOn(MockDatabaseService.prototype, 'selectRandomTickets').and.returnValue(Promise.reject('db error'));
      spyOn(MockAlertController.prototype, 'create').and.callThrough();
      spyOn(MockLoading.prototype, 'present');

      comp.ngOnInit();
      tick();

      expect(MockDatabaseService.prototype.openDatabase).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.selectRandomTickets).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.selectRandomCredentials).toHaveBeenCalledTimes(1);

      expect(MockAlertController.prototype.create).toHaveBeenCalledTimes(1);
      expect(MockLoading.prototype.present).toHaveBeenCalledTimes(1);
    }));

    it('should map random credentials and tickets in the view', fakeAsync(() => {
      comp.ngOnInit();
      tick();

      fixture.detectChanges();
      let de: DebugElement[] = fixture.debugElement.queryAll(By.css('ion-row > button:first-child'));

      expect(de[0].nativeElement.textContent.trim()).toBe('Credential 1');
      expect(de[1].nativeElement.textContent.trim()).toBe('Credential 2');
      expect(de[2].nativeElement.textContent.trim()).toBe('Ticket 1');
      expect(de[3].nativeElement.textContent.trim()).toBe('Ticket 2');
    }));

  });

  describe('should perform a search and redirect to scan-result', () => {

    beforeEach(fakeAsync(() => {
      spyOn(MockSpinnerService.prototype, 'createAndShow');
      spyOn(MockSpinnerService.prototype, 'dismiss');
      spyOn(MockExecTimeService.prototype, 'setTime');

      spyOn(comp, 'resolveSearch').and.returnValue(Promise.resolve(800));
      spyOn(comp, 'goToScanResult');

      comp.search('some-db-string', 'ticket');

      tick();
    }));

    it('should create and show a spinner', () => {
      expect(MockSpinnerService.prototype.createAndShow).toHaveBeenCalledTimes(1);
      expect(MockSpinnerService.prototype.createAndShow).toHaveBeenCalledWith(
        'Wait for the DB search...'
      );
    });

    it('should resolve the type of search and perform it', () => {
      expect(comp.resolveSearch).toHaveBeenCalledTimes(1);
      expect(comp.resolveSearch).toHaveBeenCalledWith('some-db-string', 'ticket');
    });

    it('should set the time to perform the search', () => {
      expect(MockExecTimeService.prototype.setTime).toHaveBeenCalledTimes(1);
      expect(MockExecTimeService.prototype.setTime).toHaveBeenCalledWith('dbStringSearchTime', 800);
    });

    it('should dismiss the spinner and redirect to scan-result page', () => {
      expect(MockSpinnerService.prototype.dismiss).toHaveBeenCalledTimes(1);
      expect(comp.goToScanResult).toHaveBeenCalledTimes(1);
    });

  });

  describe('should choose the type of search to perform', () => {

    beforeEach(() => {
      spyOn(comp, 'searchForCredential').and.returnValue(Promise.resolve(200));
      spyOn(comp, 'searchForTicket').and.returnValue(Promise.resolve(400));

      comp.scanResult = new ScanResult();
    });

    it('should perform a search for a credential', done => {
      comp.resolveSearch('credential-string', 'credential')
        .then(res => {
          expect(comp.searchForTicket).toHaveBeenCalledTimes(0);

          expect(comp.searchForCredential).toHaveBeenCalledTimes(1);
          expect(comp.searchForCredential).toHaveBeenCalledWith('credential-string');

          expect(res).toBe(200);

          done();
        });
    });

    it('should perform a search for a ticket', done => {
      comp.resolveSearch('ticket-string', 'ticket')
        .then(res => {
          expect(comp.searchForCredential).toHaveBeenCalledTimes(0);

          expect(comp.searchForTicket).toHaveBeenCalledTimes(1);
          expect(comp.searchForTicket).toHaveBeenCalledWith('ticket-string');

          expect(res).toBe(400);

          done();
        });
    });

    it('should perform a search for both a ticket and a credential', done => {
      comp.resolveSearch('db-string')
        .then(res => {
          expect(comp.searchForCredential).toHaveBeenCalledTimes(1);
          expect(comp.searchForCredential).toHaveBeenCalledWith('db-string');

          expect(comp.searchForTicket).toHaveBeenCalledTimes(1);
          expect(comp.searchForTicket).toHaveBeenCalledWith('db-string');

          expect(res).toBe(600);

          done();
        });
    });

  });

  describe('should perform a search using a ticket id', () => {

    let searchTime: number;

    beforeEach(done => {
      spyOn(MockDatabaseService.prototype, 'searchForTicket').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'searchForCredentialById').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'searchForRegistrant').and.callThrough();

      comp.scanResult = new ScanResult();

      comp.searchForTicket('barcode-id')
        .then(result => {
          searchTime = result;
          done();
        });
    });

    it('should search for the ticket', () => {
      expect(MockDatabaseService.prototype.searchForTicket).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.searchForTicket).toHaveBeenCalledWith('barcode-id');

      expect(comp.scanResult.ticket).toBeTruthy();
      expect(comp.scanResult.ticket.barcodeId).toBe('barcode-id');
    });

    it('should search for the credential linked to the ticket', () => {
      expect(MockDatabaseService.prototype.searchForCredentialById).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.searchForCredentialById).toHaveBeenCalledWith('manifest-id');

      expect(comp.scanResult.ticket).toBeTruthy();
      expect(comp.scanResult.ticket.manifestId).toBe('manifest-id');
    });

    it('should search for the registrant linked to the ticket', () => {
      expect(MockDatabaseService.prototype.searchForRegistrant).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.searchForRegistrant).toHaveBeenCalledWith('registrant-id');

      expect(comp.scanResult.registrant).toBeTruthy();
      expect(comp.scanResult.registrant.registrantId).toBe('registrant-id');
    });

    it('should return the time to perform the search', () => {
      expect(searchTime).toBe(2000);
    });

  });

  describe('should perform a search using a credential id', () => {

    let searchTime: number;

    beforeEach(done => {
      spyOn(MockDatabaseService.prototype, 'searchForCredential').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'searchForTicketByManifestId').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'searchForRegistrant').and.callThrough();

      comp.scanResult = new ScanResult();

      comp.searchForCredential('scan-code')
        .then(result => {
          searchTime = result;
          done();
        });
    });

    it('should search for the credential', () => {
      expect(MockDatabaseService.prototype.searchForCredential).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.searchForCredential).toHaveBeenCalledWith('scan-code');

      expect(comp.scanResult.manifest).toBeTruthy();
      expect(comp.scanResult.manifest.scanCode).toBe('scan-code');
    });

    it('should search for the ticket linked to the credential', () => {
      expect(MockDatabaseService.prototype.searchForTicketByManifestId).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.searchForTicketByManifestId).toHaveBeenCalledWith('manifest-id');

      expect(comp.scanResult.ticket).toBeTruthy();
      expect(comp.scanResult.ticket.manifestId).toBe('manifest-id');
    });

    it('should search for the registrant linked to the credential', () => {
      expect(MockDatabaseService.prototype.searchForRegistrant).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.searchForRegistrant).toHaveBeenCalledWith('registrant-id');

      expect(comp.scanResult.registrant).toBeTruthy();
      expect(comp.scanResult.registrant.registrantId).toBe('registrant-id');
    });

    it('should return the time to perform the search', () => {
      expect(searchTime).toBe(2000);
    });

  });

  it('should redirect to the scan-result page', () => {
    spyOn(App.prototype, 'getRootNav').and.returnValue(new MockNavController());
    spyOn(MockNavController.prototype, 'push');

    comp.goToScanResult();

    expect(App.prototype.getRootNav).toHaveBeenCalledTimes(1);
    expect(MockNavController.prototype.push).toHaveBeenCalledTimes(1);
    expect(MockNavController.prototype.push).toHaveBeenCalledWith(
      ScanResultPage,
      comp.scanResult,
      {animate: true, direction: 'forward'}
    );
  });

});
