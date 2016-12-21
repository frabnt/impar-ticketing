import { LogoutComponent } from "./logout-component";
import { ComponentFixture, async, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { App, Config, Platform, IonicModule, AlertController } from "ionic-angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MockAlertController, MockPlatform, MockLoading, MockNavController } from "../../../mocks";
import { SpinnerService } from "../../../services/utils/spinner-service";
import { MockSpinnerService } from "../../../services/utils/mock-spinner-service";
import { VfsApiService } from "../../../services/vfs-api/vfs-api-service";
import { MockVfsApiService } from "../../../services/vfs-api/mock-vfs-api-service";
import { DatabaseService } from "../../../services/database/database-service";
import { MockDatabaseService } from "../../../services/database/mock-database-service";
import { LoginPage } from "../../login/login";

/**
 * Created by francesco on 20/12/2016.
 */

describe('Pages-components: Logout', () => {

  let comp:    LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoutComponent
      ],
      providers: [
        App, Config,
        { provide: Platform, useClass: MockPlatform },
        { provide: VfsApiService, useClass: MockVfsApiService },
        { provide: DatabaseService, useClass: MockDatabaseService },
        { provide: SpinnerService, useClass: MockSpinnerService },
        { provide: AlertController, useClass: MockAlertController }
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(LogoutComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should show a logout confirmation alert', () => {
    spyOn(MockAlertController.prototype, 'create').and.callThrough();
    spyOn(MockLoading.prototype, 'present');

    comp.showLogoutConfirmation();

    expect(MockAlertController.prototype.create).toHaveBeenCalledTimes(1);
    expect(MockLoading.prototype.present).toHaveBeenCalledTimes(1);
  });

  describe('should perform the logout', () => {

    beforeEach(fakeAsync(() => {
      spyOn(MockSpinnerService.prototype, 'createAndShow');
      spyOn(MockSpinnerService.prototype, 'dismiss');

      spyOn(MockVfsApiService.prototype, 'doLogout').and.callThrough();

      spyOn(MockDatabaseService.prototype, 'openDatabase').and.callThrough();
      spyOn(MockDatabaseService.prototype, 'clear').and.callThrough();

      spyOn(App.prototype, 'getRootNav').and.returnValue(new MockNavController());
      spyOn(MockNavController.prototype, 'setRoot');

      comp.performLogout();
      tick();
    }));

    it('should show the spinner and dismiss it after logout', () => {
      expect(MockSpinnerService.prototype.createAndShow).toHaveBeenCalledTimes(1);
      expect(MockSpinnerService.prototype.createAndShow).toHaveBeenCalledWith(
        'Waiting for logout...'
      );
      expect(MockSpinnerService.prototype.dismiss).toHaveBeenCalledTimes(1);
    });

    it('should do logout using vfs-api', () => {
      expect(MockVfsApiService.prototype.doLogout).toHaveBeenCalledTimes(1);
    });

    it('should open and clear the database', () => {
      expect(MockDatabaseService.prototype.openDatabase).toHaveBeenCalledTimes(1);
      expect(MockDatabaseService.prototype.clear).toHaveBeenCalledTimes(1);
    });

    it('should set login page as root page', () => {
      expect(App.prototype.getRootNav).toHaveBeenCalledTimes(1);

      expect(MockNavController.prototype.setRoot).toHaveBeenCalledTimes(1);
      expect(MockNavController.prototype.setRoot).toHaveBeenCalledWith(
        LoginPage,
        {},
        {animate: true, direction: 'forward'}
      );
    });

  })

});
