import { Pipe, PipeTransform } from "@angular/core";
/**
 * Created by francesco on 12/11/2016.
 */

@Pipe({
  name: "formatNumber"
})
export class NumberPipe implements PipeTransform {

  /**
   * Format a number with a thousand separator
   * @param value - the value to transform
   * @param thousandsSeparator
   * @returns {string}
   */
  transform(value: number, thousandsSeparator: string = '.'): string {
    return value.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  }

}
