import {
  async, TestBed,
  ComponentFixture,
  fakeAsync, tick
} from "@angular/core/testing";

import {
  NavController, Platform, App,
  Config, Form, PopoverController, Keyboard,
  MenuController, DomController, IonicModule
} from "ionic-angular";

import { WelcomePage } from "./welcome";
import { MockStorage, MockNavController, MockPlatform } from "../../mocks";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { HomeTabs } from "../home-tabs/tabs";
import { LoginPage } from "../login/login";
/**
 * Created by francesco on 19/12/2016.
 */

describe('Pages: Welcome', () => {

  let comp:    WelcomePage;
  let fixture: ComponentFixture<WelcomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WelcomePage
      ],
      providers: [
        App, Config, Form,
        PopoverController, Keyboard,
        DomController, MenuController,
        { provide: Platform, useClass: MockPlatform },
        { provide: Storage, useClass: MockStorage },
        { provide: NavController, useClass: MockNavController }
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(WelcomePage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should show app name', () => {
    let de: DebugElement = fixture.debugElement.query(By.css('#appNameDiv'));
    expect(de.nativeElement.textContent.trim()).toBe('ImPar App');
  });

  describe('should set root page', () => {

    beforeEach(() => {
      spyOn(MockNavController.prototype, 'setRoot').and.callThrough();
    });

    it('should retrieve credentials and set HomeTabs as root page', fakeAsync(() => {
      spyOn(MockStorage.prototype, 'get').and.callThrough();
      comp.ionViewDidLoad();
      tick();

      expect(MockStorage.prototype.get).toHaveBeenCalledTimes(2);
      expect(MockStorage.prototype.get).toHaveBeenCalledWith('eventID');
      expect(MockStorage.prototype.get).toHaveBeenCalledWith('apiToken');

      expect(MockNavController.prototype.setRoot).toHaveBeenCalledTimes(1);
      expect(MockNavController.prototype.setRoot).toHaveBeenCalledWith(
        HomeTabs,
        {},
        { animate: true, direction: 'forward' }
      );
    }));

    it('should retrieve credentials and set LoginPage as root page', fakeAsync(() => {
      spyOn(MockStorage.prototype, 'get').and.returnValue(Promise.resolve());
      comp.ionViewDidLoad();
      tick();

      expect(MockStorage.prototype.get).toHaveBeenCalledTimes(2);
      expect(MockStorage.prototype.get).toHaveBeenCalledWith('eventID');
      expect(MockStorage.prototype.get).toHaveBeenCalledWith('apiToken');

      expect(MockNavController.prototype.setRoot).toHaveBeenCalledTimes(1);
      expect(MockNavController.prototype.setRoot).toHaveBeenCalledWith(
        LoginPage,
        {},
        { animate: true, direction: 'forward' }
      );
    }));

  });

});
