import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
} from 'rxjs/operators';

@Component({
  selector: 'app-question1',
  templateUrl: './question1.component.html',
  styleUrls: ['./question1.component.scss'],
})
export class Question1Component implements OnInit, OnDestroy {
  @ViewChild('numInput', { static: true }) numInput: ElementRef;
  @ViewChild('typeInput', { static: true }) typeInput: ElementRef;
  result$: Observable<boolean>;
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor() {}
  /******************** Lift Cycle Hook ***************/
  ngOnInit(): void {
    const numChanged$ = fromEvent(this.numInput.nativeElement, 'keyup').pipe(
      debounceTime(1000),
      map((event: any) => {
        let numText = event.target.value;
        const num = this.calDefaultNum(numText);
        if (isNaN(num)) {
          this.numInput.nativeElement.value = '';
        } else {
          this.numInput.nativeElement.value = num;
        }

        return num;
      }),
      shareReplay({ refCount: true, bufferSize: 1 }),
      takeUntil(this._unsubscribeAll)
    );

    const typeChanged$ = fromEvent(this.typeInput.nativeElement, 'change').pipe(
      map((event: any) => {
        console.log(event);
        return event.target.value;
      }),
      shareReplay({ refCount: true, bufferSize: 1 }),
      takeUntil(this._unsubscribeAll)
    );

    this.result$ = combineLatest([numChanged$, typeChanged$]).pipe(
      map(([num, typeText]) => {
        console.log(num, typeText);
        if (typeText === 'isPrime') {
          return this.isPrime(num);
        } else {
          return this.isFibonacci(num);
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /******************** Function ***************/
  calDefaultNum(numText: string): number {
    if (numText.trim().length === 0) {
      return NaN;
    }
    const num = Number(numText);
    const numInt = Math.round(num);
    if (numInt < 0) {
      return 1;
    } else {
      return numInt;
    }
  }
  isPrime(num: number): boolean {
    for (let i = 2; i < num; i++) if (num % i === 0) return false;
    return num > 1;
  }
  isPerfectSquare(num: number): boolean {
    const s = Math.sqrt(num);
    return s * s == num;
  }
  isFibonacci(num: number) {
    if (
      this.isPerfectSquare(5 * (num * num) - 4) ||
      this.isPerfectSquare(5 * (num * num) + 4)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
