import { PopoverMenu } from "./popover-menu";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { LogoutComponent } from "../pages-components/logout-component/logout-component";

import {
  App, Config, Form, Platform, DomController, ViewController, IonicModule,
  GestureController, AlertController, NavController
} from "ionic-angular";

import { MockViewController, MockAlertController, MockNavController, MockPlatform } from "../../mocks";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SpinnerService } from "../../services/utils/spinner-service";
import { MockSpinnerService } from "../../services/utils/mock-spinner-service";
import { DatabaseService } from "../../services/database/database-service";
import { MockDatabaseService } from "../../services/database/mock-database-service";
import { VfsApiService } from "../../services/vfs-api/vfs-api-service";
import { MockVfsApiService } from "../../services/vfs-api/mock-vfs-api-service";
/**
 * Created by francesco on 20/12/2016.
 */

describe('Pages: Popover-menu', () => {

  let comp:    PopoverMenu;
  let fixture: ComponentFixture<PopoverMenu>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PopoverMenu,
        LogoutComponent
      ],
      providers: [
        App, Config, Form, DomController, GestureController,
        { provide: Platform, useClass: MockPlatform },
        { provide: NavController, useClass: MockNavController },
        { provide: VfsApiService, useClass: MockVfsApiService },
        { provide: DatabaseService, useClass: MockDatabaseService },
        { provide: SpinnerService, useClass: MockSpinnerService },
        { provide: AlertController, useClass: MockAlertController },
        { provide: ViewController, useClass: MockViewController }
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(PopoverMenu);
      comp = fixture.componentInstance;
    });
  }));

  it('should create the menu', () => {
    expect(comp).toBeTruthy();
  });

  it('should dismiss the menu', () => {
    spyOn(MockViewController.prototype, 'dismiss');
    comp.dismissMenu();

    expect(MockViewController.prototype.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should navigate to the home page', () => {
    spyOn(comp, 'dismissMenu');
    spyOn(App.prototype, 'getRootNav').and.returnValue(new MockNavController());
    spyOn(MockNavController.prototype, 'pop');

    comp.goHome();

    expect(comp.dismissMenu).toHaveBeenCalledTimes(1);
    expect(App.prototype.getRootNav).toHaveBeenCalledTimes(1);
    expect(MockNavController.prototype.pop).toHaveBeenCalledTimes(1);
  });

});
