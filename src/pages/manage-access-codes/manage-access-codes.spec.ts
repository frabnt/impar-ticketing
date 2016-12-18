import { ModifyAccessCodePage } from "./manage-access-codes";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  App, MenuController,
  Platform, Config, Keyboard,
  IonicModule, NavParams,
  PopoverController, Form,
  DomController, ViewController,
  AlertController, GestureController,
}  from 'ionic-angular';

import {
  MockNavParams, MockStorage,
  MockViewController,
  MockAlertController
} from "../../mocks";

import { LogoComponent } from "../pages-components/logo-component/logo-component";
import { Storage } from "@ionic/storage";
/**
 * Created by francesco on 15/12/2016.
 */

describe('Pages: Manage-access-codes', () => {

  let comp:    ModifyAccessCodePage;
  let fixture: ComponentFixture<ModifyAccessCodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoComponent,
        ModifyAccessCodePage
      ],
      providers: [
        App, Platform, Config, Form,
        PopoverController, Keyboard,
        DomController, MenuController,
        GestureController,
        { provide: ViewController, useClass: MockViewController },
        { provide: AlertController, useClass: MockAlertController },
        { provide: Storage, useClass: MockStorage },
        { provide: NavParams, useClass: MockNavParams },
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ],
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(ModifyAccessCodePage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should retrieve access codes list through nav params', () => {
    expect(comp.codeList).toEqual(['code-1', 'code-2']);
  });

  it('should contain [0,1] in numbers list', () => {
    expect(comp.numbers).toEqual([0, 1]);
  });

  it('should not have the access codes list modified', () => {
    expect(comp.listModified).toBeUndefined();
  });

  it('should set the access codes list as modified', () => {
    comp.setModified();
    expect(comp.listModified).toBe(true);
  });

  it('should add a new access code to the list', () => {
    spyOn(comp, 'setModified');
    comp.addCode('new-code');
    
    expect(comp.setModified).toHaveBeenCalledTimes(1);

    expect(comp.codeList.slice(-1).pop()).toBe('new-code');
    expect(comp.numbers.slice(-1).pop()).toBe(2);
  });

  it('should remove the access code from the list', () => {
    spyOn(comp, 'setModified');
    expect(comp.codeList).toEqual(['code-1', 'code-2']);
    expect(comp.numbers).toEqual([0, 1]);

    comp.deleteCode(1);

    expect(comp.setModified).toHaveBeenCalledTimes(1);
    expect(comp.codeList).toEqual(['code-1']);
    expect(comp.numbers).toEqual([0]);
  });

  it('should update the access code', () => {
    spyOn(comp, 'setModified');
    comp.updateState(
      {target: {value: 'new-value'}}, 1);

    expect(comp.setModified).toHaveBeenCalledTimes(1);
    expect(comp.codeList[1]).toBe('new-value');
  });

  describe('should exit from the view', () => {
    it('should show a saving confirmation message', () => {
      comp.listModified = true;
      spyOn(comp, 'showSavingConfirmation').and.returnValue(true);
      comp.exit();

      expect(comp.showSavingConfirmation).toHaveBeenCalledTimes(1);
    });

    it('should exit without showing a confirmation message', () => {
      spyOn(MockViewController.prototype, 'dismiss').and.returnValue(true);
      comp.exit();

      expect(MockViewController.prototype.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  it('should show a saving confirmation message', () => {
    spyOn(MockAlertController.prototype, 'create').and.callThrough();
    comp.showSavingConfirmation();

    expect(MockAlertController.prototype.create).toHaveBeenCalledTimes(1);
  });

  describe('should save access codes list', () => {
    beforeEach(() => {
      spyOn(MockViewController.prototype, 'dismiss').and.callThrough();
    });

    it('should dismiss the view after saving', (done) => {
      spyOn(MockStorage.prototype, 'set').and.callThrough();

      comp.save().then(() => {
        expect(MockStorage.prototype.set).toHaveBeenCalledTimes(1);
        expect(MockStorage.prototype.set).toHaveBeenCalledWith('accessCodes', ['code-1', 'code-2']);
        expect(MockViewController.prototype.dismiss).toHaveBeenCalledTimes(1);

        done();
      });
    });

    it('should show an error if the saving goes wrong', (done) => {
      spyOn(MockStorage.prototype, 'set').and.returnValue(Promise.reject('error saving'));
      spyOn(MockAlertController.prototype, 'create').and.callThrough();

      comp.save()
        .catch(err => {
          expect(MockStorage.prototype.set).toHaveBeenCalledTimes(1);
          expect(MockStorage.prototype.set).toHaveBeenCalledWith('accessCodes', ['code-1', 'code-2']);
          expect(MockViewController.prototype.dismiss).toHaveBeenCalledTimes(1);
          expect(MockAlertController.prototype.create).toHaveBeenCalledTimes(1);
          expect(err).toBe('error saving');

          done();
        });
    });
  });

});
