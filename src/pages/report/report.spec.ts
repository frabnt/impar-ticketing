import {
  async, TestBed,
  ComponentFixture,
  fakeAsync, tick
} from "@angular/core/testing";

import {
  App, Config, Form, Platform,
  PopoverController, Keyboard, DomController,
  MenuController, AlertController, IonicModule
} from "ionic-angular";

import { ReportPage } from "./report";
import { MockAlertController, MockLoading } from "../../mocks";
import { DatabaseService } from "../../services/database/database-service";
import { MockDatabaseService } from "../../services/database/mock-database-service";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { MockExecTimeService } from "../../services/exec-time/mock-exec-time-service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LogoComponent} from "../pages-components/logo-component/logo-component";
import { LogoutComponent } from "../pages-components/logout-component/logout-component";
import { MockSpinnerService } from "../../services/utils/mock-spinner-service";
import { SpinnerService } from "../../services/utils/spinner-service";
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
import { MockVfsApiService } from "../../services/vfs-api/mock-vfs-api-service";
/**
 * Created by francesco on 19/12/2016.
 */

describe('Pages: Report', () => {

  let comp:    ReportPage;
  let fixture: ComponentFixture<ReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportPage,
        LogoComponent,
        LogoutComponent
      ],
      providers: [
        App, Config, Form, Platform,
        PopoverController, Keyboard,
        DomController, MenuController,
        { provide: VfsApiService, useClass: MockVfsApiService },
        { provide: AlertController, useClass: MockAlertController },
        { provide: SpinnerService, useClass: MockSpinnerService },
        { provide: DatabaseService, useClass: MockDatabaseService },
        { provide: ExecTimeService, useClass: MockExecTimeService }
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents().then(() => {
        spyOn(MockExecTimeService.prototype, 'getTime').and.callThrough();

        fixture = TestBed.createComponent(ReportPage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should retrieve the time to perform tickets and manifest mapping', () => {
    expect(MockExecTimeService.prototype.getTime).toHaveBeenCalledTimes(2);
    expect(MockExecTimeService.prototype.getTime).toHaveBeenCalledWith('ticketsTime');
    expect(MockExecTimeService.prototype.getTime).toHaveBeenCalledWith('manifestTime');

    expect(comp.manifestTime).toBe(1000);
    expect(comp.ticketsTime).toBe(1000);
  });

  describe('should retrieve stats', () => {
    beforeEach(() => {
      spyOn(MockDatabaseService.prototype, 'calculateStats').and.callThrough();
    });

    it('should open the database and retrieve calculated stats', fakeAsync(() => {
      spyOn(MockDatabaseService.prototype, 'openDatabase').and.callThrough();

      comp.ngOnInit();
      tick();

      expect(MockDatabaseService.prototype.openDatabase).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.calculateStats).toHaveBeenCalledTimes(1);
      expect(comp.totalManifest).toBe(2);
      expect(comp.totalTickets).toBe(2);
    }));

    it('should show an error message if a db operation fails', fakeAsync(() => {
      spyOn(MockAlertController.prototype, 'create').and.callThrough();
      spyOn(MockLoading.prototype, 'present').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'openDatabase').and.returnValue(Promise.reject('error'));

      comp.ngOnInit();
      tick();

      expect(MockDatabaseService.prototype.openDatabase).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.calculateStats).toHaveBeenCalledTimes(0);
      expect(MockAlertController.prototype.create).toHaveBeenCalledTimes(1);
      expect(MockLoading.prototype.present).toHaveBeenCalledTimes(1);
    }));
  });

});
