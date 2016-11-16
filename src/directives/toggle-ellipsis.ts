import { Directive, ElementRef, Renderer } from '@angular/core';
/**
 * Created by francesco on 13/11/2016.
 */

@Directive({
  selector:'[toggle-ellipsis]',
  host: {
    '(click)': 'onMouseEnter()'
  }
})
export class ToggleEllipsis {
  private isSet: boolean = true;

  constructor(private el: ElementRef, private renderer: Renderer) {
    renderer.setElementClass(el.nativeElement, 'ellipsis', this.isSet);
  }

  /**
   * On mouse click toggle ellipsis-class on html element
   */
  onMouseEnter() {
    this.isSet = !this.isSet;
    this.renderer.setElementClass(this.el.nativeElement, 'ellipsis', this.isSet);
  }
}
