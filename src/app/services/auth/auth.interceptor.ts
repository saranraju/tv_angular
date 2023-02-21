import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
    let token: any = localStorage.getItem('access_token');
    let bearerToken: any = 'Bearer ' + localStorage.getItem('access_token');

    var setHeaders = {
      Authorization: bearerToken,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Content-Type': 'application/json',
    };

    // clone req
    let customReq: any;
    if (token && token != null && token != 'dummytoken') {
      customReq = request.clone({
        setHeaders: setHeaders,
      });
    } else {
      customReq = request;
    }
    return next.handle(customReq).pipe(
      tap(
        (event: any) => {
          if (event instanceof HttpResponse) {
            // http response
          }
        },
        (error: any) => {
          // http response status code
          // console.error(error.status);
          // console.error(error.message);
          if (error.status == 401) {
            localStorage.removeItem('access_token');
            window.location.pathname = '/login';
          }
        }
      )
    );
  }
}
