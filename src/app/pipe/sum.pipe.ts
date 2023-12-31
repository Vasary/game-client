import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(value: number[]): number {
    return value.reduce((sum, current) => sum + current, 0);
  }
}
