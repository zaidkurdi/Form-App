import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: ApiService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }

    return next.handle(authReq).pipe(
      catchError((err) => {
        if (err.status === 403 && !req.url.includes('/refresh')) {
          return this.auth.refreshToken().pipe(
            switchMap((res: any) => {
              localStorage.setItem('accessToken', res.accessToken);
              const newReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${res.accessToken}`
                ),
              });
              return next.handle(newReq);
            }),
            catchError(() => {
              // clear bad tokens
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              this.router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
