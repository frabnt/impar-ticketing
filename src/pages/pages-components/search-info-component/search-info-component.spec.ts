import { SearchInfoComponent } from "./search-info-component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { App, Config, Platform, NavParams, IonicModule } from "ionic-angular";
import { MockPlatform, MockNavParams } from "../../../mocks";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
/**
 * Created by francesco on 21/12/2016.
 */

describe('Pages-components: Search-info', () => {

  let comp:    SearchInfoComponent;
  let fixture: ComponentFixture<SearchInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchInfoComponent
      ],
      providers: [
        App, Config,
        { provide: Platform, useClass: MockPlatform },
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

        fixture = TestBed.createComponent(SearchInfoComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should retrieve searched db string through nav params', () => {
    expect(MockNavParams.prototype.get).toHaveBeenCalledTimes(1);
    expect(MockNavParams.prototype.get).toHaveBeenCalledWith('dbString');

    expect(comp.searchedDBString).toBe('searched-string');
  });

  it('should show searched db string in the view', () => {
    fixture.detectChanges();

    let de: DebugElement = fixture.debugElement.query(By.css('ion-row ion-col:last-child'));
    expect(de.nativeElement.textContent.trim()).toBe('searched-string');
  });

});
