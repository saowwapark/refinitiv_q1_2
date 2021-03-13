import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Question2Service {
  private url = 'https://api.publicapis.org/categories';
  constructor(private _http: HttpClient) {}

  getData(): Observable<string[]> {
    return this._http.get(this.url) as Observable<string[]>;
  }
}
