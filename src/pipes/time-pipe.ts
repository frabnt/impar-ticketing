import { Pipe, PipeTransform } from "@angular/core";
/**
 * Created by francesco on 12/11/2016.
 */

@Pipe({
  name: "convertTime"
})
export class TimePipe implements PipeTransform {

  /**
   * Divide a number for a power of ten
   * @param value - the number to divide
   * @param exponent
   * @returns {number}
   */
  transform(value: number, exponent: number = 0): number {
    return value / Math.pow(10, exponent);
  }

}
