import { async, ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { LoginPage } from "./login";
import { LogoComponent } from "../pages-components/logo-component/logo-component";
import {
  App, Config, DomController, Keyboard, MenuController, Form, NavController, Platform,
  AlertController, ModalController, IonicModule
} from "ionic-angular";
import { FormBuilder, ReactiveFormsModule, FormsModule } from "@angular/forms";
import {
  MockNavController, MockStorage, MockPlatform, MockAlertController, MockModalController,
  MockModal, MockLoading
} from "../../mocks";
import { Storage } from "@ionic/storage";
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
import { MockVfsApiService } from "../../services/vfs-api/mock-vfs-api-service";
import { SpinnerService } from "../../services/utils/spinner-service";
import { MockSpinnerService } from "../../services/utils/mock-spinner-service";
import { DatabaseService } from "../../services/database/database-service";
import { MockDatabaseService } from "../../services/database/mock-database-service";
import { DBMappingService } from "../../services/db-mapping/db-mapping-service";
import { MockDBMappingService } from "../../services/db-mapping/mock-db-mapping-service";
import { HomeTabs } from "../home-tabs/tabs";
import { ModifyAccessCodePage } from "../manage-access-codes/manage-access-codes";
import { Deserialize } from "cerialize";
import { MOCK_MANIFEST } from "../../services/vfs-api/mock-data";
import { Manifest } from "../../models/manifest";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { TicketsPaginationService } from "../../services/tickets-pagination/tickets-pagination-service";
/**
 * Created by francesco on 22/12/2016.
 */

describe('Pages: Login', () => {

  let comp:    LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPage,
        LogoComponent
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        App, Config, Keyboard, FormBuilder,
        DomController, MenuController, Form,
        TicketsPaginationService,
        { provide: ModalController, useClass: MockModalController },
        { provide: NavController, useClass: MockNavController },
        { provide: Storage, useClass: MockStorage },
        { provide: Platform, useClass: MockPlatform },
        { provide: DBMappingService, useClass: MockDBMappingService },
        { provide: VfsApiService, useClass: MockVfsApiService },

        { provide: AlertController, useClass: MockAlertController },
        { provide: SpinnerService, useClass: MockSpinnerService },
        { provide: DatabaseService, useClass: MockDatabaseService },
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(LoginPage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should retrieve stored access codes', fakeAsync(() => {
    spyOn(MockStorage.prototype, 'get').and.callThrough();

    fixture.detectChanges();
    tick();

    expect(MockStorage.prototype.get).toHaveBeenCalledTimes(1);
    expect(MockStorage.prototype.get).toHaveBeenCalledWith('accessCodes');
    expect(comp.accessCodesList).toEqual(['code-1', 'code-2']);
  }));

  it('should map stored access code in the view', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    let de: DebugElement[] = fixture.debugElement.queryAll(By.css('ion-item-group > button'));

    expect(de[0].nativeElement.textContent.trim()).toBe('code-1');
    expect(de[1].nativeElement.textContent.trim()).toBe('code-2');
  }));

  describe('should perform the login', () => {

    describe('should do the login and map retrieved data', () => {

      beforeEach(fakeAsync(() => {
        spyOn(MockVfsApiService.prototype, 'doLogin').and.callThrough();
        spyOn(MockDBMappingService.prototype, 'mapManifestData').and.callThrough();

        spyOn(TicketsPaginationService.prototype, 'getAllTickets').and.callFake(() => {
          return Promise.resolve();
        });

        spyOn(MockDatabaseService.prototype, 'openDatabase').and.callThrough();
        spyOn(MockDatabaseService.prototype, 'createTables').and.callThrough();

        spyOn(MockVfsApiService.prototype, 'getManifest').and.callThrough();

        spyOn(MockSpinnerService.prototype, 'createAndShow');
        spyOn(MockSpinnerService.prototype, 'setContent');
        spyOn(comp, 'goToHome');

        comp.login('my-code');

        tick();
      }));

      it('should do login', () => {
        expect(MockVfsApiService.prototype.doLogin).toHaveBeenCalledTimes(1);
        expect(MockVfsApiService.prototype.doLogin).toHaveBeenCalledWith('my-code');
      });

      it('should open the database and create tables', () => {
        expect(MockDatabaseService.prototype.openDatabase).toHaveBeenCalledTimes(1);
        expect(MockDatabaseService.prototype.createTables).toHaveBeenCalledTimes(1);
      });

      it('should retrieve tickets and manifest data', () => {
        expect(MockVfsApiService.prototype.getManifest).toHaveBeenCalledTimes(1);
      });

      it('should map retrieved data in the database', () => {
        expect(MockDBMappingService.prototype.mapManifestData).toHaveBeenCalledTimes(1);
        expect(MockDBMappingService.prototype.mapManifestData).toHaveBeenCalledWith(
          Deserialize(MOCK_MANIFEST, Manifest)
        );
      });

      it('should create, show and update a spinner during login', () => {
        expect(MockSpinnerService.prototype.createAndShow).toHaveBeenCalledTimes(1);
        expect(MockSpinnerService.prototype.createAndShow).toHaveBeenCalledWith(
          'Waiting for login...'
        );

        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledTimes(3);
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Creating tables...');
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Retrieving and deserializing manifest data...');
        expect(MockSpinnerService.prototype.setContent).toHaveBeenCalledWith('Mapping manifest data...');
      });

      it('should redirect to the home page', () => {
        expect(comp.goToHome).toHaveBeenCalledTimes(1);
      });

    });

    describe('should show an error message if login fails', () => {
      beforeEach(fakeAsync(() => {
        spyOn(MockAlertController.prototype, 'create').and.callThrough();
        spyOn(MockLoading.prototype, 'present');
        spyOn(MockVfsApiService.prototype, 'doLogin').and.returnValue(Promise.reject('login fails'));
        spyOn(MockSpinnerService.prototype, 'dismiss');
        spyOn(MockDatabaseService.prototype, 'openDatabase');

        comp.login('my-code');
        tick();
      }));

      it('should dismiss the spinner', () => {
        expect(MockSpinnerService.prototype.dismiss).toHaveBeenCalledTimes(1);
      });

      it('should try to do login', () => {
        expect(MockVfsApiService.prototype.doLogin).toHaveBeenCalledTimes(1);
        expect(MockVfsApiService.prototype.doLogin).toHaveBeenCalledWith('my-code');
        expect(MockDatabaseService.prototype.openDatabase).toHaveBeenCalledTimes(0);
      });

      it('should create and show an alert showing the error occurred', () => {
        expect(MockAlertController.prototype.create).toHaveBeenCalledTimes(1);
        expect(MockAlertController.prototype.create).toHaveBeenCalledWith({
          title: 'LOGIN ERROR',
          message: `Something goes wrong during login: login fails`,
          buttons: [
            {
              text: 'Ok'
            }
          ]
        });
        expect(MockLoading.prototype.present).toHaveBeenCalledTimes(1);
      });
    });

  });

  it('should redirect to home page', fakeAsync(() => {
    spyOn(MockNavController.prototype, 'setRoot');
    comp.goToHome();
    tick();

    expect(MockNavController.prototype.setRoot).toHaveBeenCalledTimes(1);
    expect(MockNavController.prototype.setRoot).toHaveBeenCalledWith(
      HomeTabs,
      { totalManifest: 2, totalTickets: 5 },
      {animate: true, direction: 'forward'}
    );
  }));

  it('should present a modal window', () => {
    spyOn(MockModalController.prototype, 'create').and.callThrough();
    spyOn(MockModal.prototype, 'onDidDismiss').and.callFake(() => {
      comp.accessCodesList = ['firstCode', 'secondCode'];
    });
    spyOn(MockModal.prototype, 'present');

    comp.accessCodesList = ['onlyOneCode'];
    comp.manageAccessCodes();

    expect(MockModalController.prototype.create).toHaveBeenCalledTimes(1);
    expect(MockModalController.prototype.create).toHaveBeenCalledWith(
      ModifyAccessCodePage, {codeList: ['onlyOneCode']}
    );

    expect(MockModal.prototype.onDidDismiss).toHaveBeenCalledTimes(1);
    expect(comp.accessCodesList).toEqual(['firstCode', 'secondCode']);
    expect(MockModal.prototype.present).toHaveBeenCalledTimes(1);
  });

});
