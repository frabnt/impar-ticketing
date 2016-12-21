import { PopoverComponent } from "./popover-component";
import { ComponentFixture, async, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, App, Config, Platform, PopoverController } from "ionic-angular";
import { MockPlatform, MockPopoverController, MockPopover } from "../../../mocks";
/**
 * Created by francesco on 21/12/2016.
 */

describe('Pages-components: Popover', () => {

  let comp:    PopoverComponent;
  let fixture: ComponentFixture<PopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PopoverComponent
      ],
      providers: [
        App, Config,
        { provide: PopoverController, useClass: MockPopoverController },
        { provide: Platform, useClass: MockPlatform },
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ]
    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(PopoverComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  it('should present the popover', () => {
    spyOn(MockPopoverController.prototype, 'create').and.callThrough();
    spyOn(MockPopover.prototype, 'present');
    comp.presentPopover('event');

    expect(MockPopoverController.prototype.create).toHaveBeenCalledTimes(1);
    expect(MockPopover.prototype.present).toHaveBeenCalledTimes(1);
    expect(MockPopover.prototype.present).toHaveBeenCalledWith({ev: 'event'});
  });

});
