import { HttpEvent } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Question2Service } from './question2.service';

@Component({
  selector: 'app-question2',
  templateUrl: './question2.component.html',
  styleUrls: ['./question2.component.scss'],
  providers: [Question2Service],
})
export class Question2Component implements OnInit, OnDestroy {
  @ViewChild('input', { static: true }) input: ElementRef;
  dataSubject: Subject<string[]>;
  getData$: Observable<string[]>;
  displayedColumns = ['categories'];
  private _unsubscribeAll = new Subject<void>();
  constructor(private _service: Question2Service) {}

  ngOnInit(): void {
    // Modify observable not to duplicate)
    this.getData$ = this._service
      .getData()
      .pipe(shareReplay({ refCount: true, bufferSize: 1 }));
    // convert getData$ to be Subject()
    this.dataSubject = new BehaviorSubject([]);
    // initial data of table
    this.getData$.subscribe((data) => {
      this.dataSubject.next(data);
    });
    // create input filter event
    const filterInput$ = fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(400),
      distinctUntilChanged(),
      map((event: any) => {
        return event.target.value;
      }),
      takeUntil(this._unsubscribeAll)
    );
    // listen event for filter
    filterInput$.subscribe((input) => this.applyFilter(input as string));
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // Mannually filter data
  applyFilter(inputValue: string) {
    this.getData$.subscribe((data) => {
      // manually
      if (!inputValue) {
        return this.dataSubject.next(data);
      } else {
        const filterValue = inputValue.trim().toLocaleLowerCase();
        const newData: string[] = [];
        data.forEach((row) => {
          if (row.toLocaleLowerCase().startsWith(filterValue)) {
            newData.push(row);
          }
        });
        this.dataSubject.next(newData);
      }
    });
  }
}
