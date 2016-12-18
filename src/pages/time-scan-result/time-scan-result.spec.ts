import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { TimeScanResultPage } from "./time-scan-result";
import { ExecTimeService } from "../../services/exec-time/exec-time-service";
import { MockExecTimeService } from "../../services/exec-time/mock-exec-time-service";

import {
  NavParams, IonicModule, Config, App,
  Platform, MenuController, PopoverController,
  Keyboard, Form, DomController
} from "ionic-angular";

import { MockNavParams } from "../../mocks";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LogoComponent } from "../pages-components/logo-component/logo-component";
import { PopoverComponent } from "../pages-components/popover-component/popover-component";
import { SearchInfoComponent } from "../pages-components/search-info-component/search-info";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
/**
 * Created by francesco on 15/12/2016.
 */

describe('Pages: Time-scan-result', () => {

  let comp:    TimeScanResultPage;
  let fixture: ComponentFixture<TimeScanResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeScanResultPage,
        LogoComponent,
        PopoverComponent,
        SearchInfoComponent
      ],
      providers: [
        App, Platform, Config, Form,
        PopoverController, Keyboard,
        DomController, MenuController,
        { provide: ExecTimeService, useClass: MockExecTimeService },
        { provide: NavParams, useClass: MockNavParams }
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents().then(() => {
        spyOn(MockNavParams.prototype, 'get').and.callThrough();
        spyOn(MockExecTimeService.prototype, 'getTime').and.callThrough();
        fixture = TestBed.createComponent(TimeScanResultPage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should retrieve search result from nav params', () => {
    expect(MockNavParams.prototype.get).toHaveBeenCalledTimes(2);
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('dbString');
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('searchSuccessful');
    expect(comp.searchResult).toBe(true);
  });

  it('should retrieve the time to perform the search', () => {
    expect(MockExecTimeService.prototype.getTime).toHaveBeenCalledTimes(1);
    expect(MockExecTimeService.prototype.getTime).toHaveBeenCalledWith('dbStringSearchTime');
    expect(comp.searchTime).toBe(1000);
  });

  it('should set image url to the "success image"', () => {
    expect(comp.resultImgUrl).toBe('assets/images/success.png');
  });

  it('should show the searched string', () => {
    fixture.detectChanges();
    let de: DebugElement = fixture.debugElement.query(By.css('search-info ion-row ion-col:last-child'));
    expect(de.nativeElement.textContent.trim()).toEqual('searched-string');
  });

  it('should map the time to perform the search in the view', () => {
    fixture.detectChanges();
    let de: DebugElement = fixture.debugElement.query(
      By.css('ion-content search-info + ion-row ion-col:last-child')
    );
    expect(de.nativeElement.textContent).toBe('1000 ms');
  });

  it('should show "SUCCESS" as img caption text', () => {
    fixture.detectChanges();
    let de: DebugElement = fixture.debugElement.query(By.css('.figcaption'));
    expect(de.nativeElement.textContent.trim()).toBe('SUCCESS');
  });

});
