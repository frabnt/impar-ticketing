import { Pipe, PipeTransform } from "@angular/core";
/**
 * Created by francesco on 12/11/2016.
 */

@Pipe({
  name: "convertTime"
})
export class TimePipe implements PipeTransform {

  /**
   * Divide a number for a power of ten and
   * replace each comma with a dot
   * @param value - the number to divide
   * @param exponent
   * @returns {number}
   */
  transform(value: number, exponent: number = 0): string {
    return ( value / Math.pow(10, exponent) )
      .toString(10)
      .replace('.', ',');
  }

}
