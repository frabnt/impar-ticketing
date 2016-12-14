import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, DebugElement } from "@angular/core";
import { ToggleEllipsis } from "./toggle-ellipsis"
import { By } from "@angular/platform-browser";
import { TestUtils } from "../test";
/**
 * Created by francesco on 30/11/2016.
 */

@Component({
  template: `
      <p toggle-ellipsis id="myParagraph">
        Click me. This is the text needs to be trimmed when too long.
      </p>
    `
})
class TestComponent { }

describe('Directives: Toggle-ellipsis', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elByDirective: DebugElement;
  let elByCss: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ ToggleEllipsis, TestComponent ]
    })
      .createComponent(TestComponent);
  });

  it('should apply toggle-ellipsis attr to the paragraph', () => {
    // Element with an attached toggle-ellipsis directive
    elByDirective = fixture.debugElement.query(By.directive(ToggleEllipsis));

    expect(elByDirective).not.toBeNull();
  });

  it('should apply ellipsis css class to the paragraph', () => {
    // Element with an attached ellipsis class
    elByCss = fixture.debugElement.query(By.css('.ellipsis'));

    expect(elByCss).not.toBeNull();
  });

  it('should remove ellipsis css class clicking on the element', () => {
    TestUtils.eventFire(document.getElementById("myParagraph"), 'click');

    elByCss = fixture.debugElement.query(By.css('.ellipsis'));
    expect(elByCss).toBeNull();
  });
});
