import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { RegistrantScanResultPage } from "./registrant-scan-result";
import { LogoComponent } from "../pages-components/logo-component/logo-component";
import { PopoverComponent } from "../pages-components/popover-component/popover-component";
import { SearchInfoComponent } from "../pages-components/search-info-component/search-info-component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  App, MenuController, Platform, Config, Keyboard, IonicModule,
  NavParams, PopoverController, DomController
}  from 'ionic-angular';

import { MockNavParams, MockPlatform } from "../../mocks";
import { DebugElement } from "@angular/core";
import { Registrant } from "../../models/registrant";
import { By } from "@angular/platform-browser";
/**
 * Created by francesco on 14/12/2016.
 */

describe('Pages: Registrant-scan-result', () => {

  let comp: RegistrantScanResultPage;
  let fixture: ComponentFixture<RegistrantScanResultPage>;
  let registrant: Registrant;

  beforeEach(async(() =>{
    TestBed.configureTestingModule({
      declarations: [
        RegistrantScanResultPage,
        LogoComponent,
        PopoverComponent,
        SearchInfoComponent
      ],
      providers: [
        App, Config, PopoverController,
        Keyboard, DomController, MenuController,
        { provide: Platform, useClass: MockPlatform },
        { provide: NavParams, useClass: MockNavParams }
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ],
    })
      .compileComponents().then(() => {
        spyOn(MockNavParams.prototype, 'get').and.callThrough();
        fixture = TestBed.createComponent(RegistrantScanResultPage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should retrieve a registrant object through nav params', () => {
    expect(MockNavParams.prototype.get).toHaveBeenCalledTimes(2);
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('dbString');
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('registrant');
    registrant = comp.registrant;

    expect(registrant).toBeTruthy();
    expect(registrant.nameFirst).toBe('Michele');
    expect(registrant.nameLast).toBe('Bartoli');
    expect(registrant.registrantId).toBe('registrant-1');
  });

  it('should map registrant properties in the view', () => {
    fixture.detectChanges();
    let de: DebugElement[] = fixture.debugElement.queryAll(By.css('ion-grid.table ion-row ion-col:last-child'));
    expect(de[0].nativeElement.textContent.trim()).toEqual(registrant.registrantId);
    expect(de[1].nativeElement.textContent.trim()).toEqual(registrant.nameFirst);
    expect(de[2].nativeElement.textContent.trim()).toEqual(registrant.nameLast);
  });

});
