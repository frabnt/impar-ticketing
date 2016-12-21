import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { ManifestScanResultPage } from "./manifest-scan-result";
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
import { ManifestEntity } from "../../models/manifest-entity";
import { By } from "@angular/platform-browser";
/**
 * Created by francesco on 14/12/2016.
 */

describe('Pages: Manifest-scan-result', () => {

  let comp:    ManifestScanResultPage;
  let fixture: ComponentFixture<ManifestScanResultPage>;
  let manifest: ManifestEntity;

  beforeEach(async(() =>{
    TestBed.configureTestingModule({
      declarations: [
        ManifestScanResultPage,
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
        fixture = TestBed.createComponent(ManifestScanResultPage);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the page', () => {
    expect(comp).toBeTruthy();
  });

  it('should select first table tabs', () => {
    expect(comp.tableTabs).toEqual('tableTab1');
  });

  it('should retrieve a ManifestEntity through nav params', () => {
    expect(MockNavParams.prototype.get).toHaveBeenCalledTimes(2);
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('dbString');
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('manifest');
    manifest = comp.manifest;

    expect(manifest).toBeTruthy();
    expect(manifest.activated).toBe('2017-01-01 15:25:36');
    expect(manifest.credentialTypeId).toBe('cred-type-id');
    expect(manifest.deactivated).toBe('2017-01-01 23:25:36');
    expect(manifest.deactivationReason).toBe('deactivation reason');
    expect(manifest.isDeleted).toBe(0);
    expect(manifest.manifestId).toBe('manifest-id');
    expect(manifest.modified).toBeNull();
    expect(manifest.scanCode).toBe('scan-code');
    expect(manifest.scanStatus).toBe('scan-status');
    expect(manifest.validationType).toBe('DIRECTIONAL');
  });

  it('should show the searched string', () => {
    fixture.detectChanges();
    let de: DebugElement = fixture.debugElement.query(By.css('search-info ion-row ion-col:last-child'));
    expect(de.nativeElement.textContent.trim()).toEqual('searched-string');
  });

  it('should map manifest properties in the view', () => {
    fixture.detectChanges();
    let de: DebugElement[] = fixture.debugElement.queryAll(By.css('ion-grid.table ion-row ion-col:last-child'));
    expect(de[0].nativeElement.textContent.trim()).toEqual(manifest.activated);
    expect(de[1].nativeElement.textContent.trim()).toEqual(manifest.credentialTypeId);
    expect(de[2].nativeElement.textContent.trim()).toEqual(manifest.deactivated);
    expect(de[3].nativeElement.textContent.trim()).toEqual(manifest.deactivationReason);
    expect(de[4].nativeElement.textContent.trim()).toEqual(manifest.isDeleted.toString());

    comp.tableTabs = 'tableTab2';
    fixture.detectChanges();
    de = fixture.debugElement.queryAll(By.css('ion-grid.table ion-row ion-col:last-child'));
    expect(de[0].nativeElement.textContent.trim()).toEqual(manifest.manifestId);
    expect(de[1].nativeElement.textContent.trim()).toEqual('empty');
    expect(de[2].nativeElement.textContent.trim()).toEqual(manifest.scanCode);
    expect(de[3].nativeElement.textContent.trim()).toEqual(manifest.scanStatus);
    expect(de[4].nativeElement.textContent.trim()).toEqual(manifest.validationType);
  });

});
