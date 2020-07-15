import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Corrs } from './model/corrs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //api_url: string = "https://w-api-dev.herokuapp.com/v1";
  api_url: string = "v1";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  correlacao(payload): Observable<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>("https://w-api-dev.herokuapp.com/v1/correlacao", payload, httpOptions)
      .pipe(
        map(response => response),
        catchError(
          (error: any, caught: Observable<HttpEvent<any>>) => {

            if (error.status === 401) {
              this.handleAuthError();
              return of(error);
            }
            throw error;
          }
        )
      );
  }

  private handleAuthError() {
    console.log("erro");
  }
}
