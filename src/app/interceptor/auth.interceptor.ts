import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PythonAnywhereService } from '../services/PythonAnywhere/python-anywhere.service'
import { UserService } from '../services/user/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private pyAnyService: PythonAnywhereService,
    private userService: UserService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.pyAnyService.getTokenPythonAnywhere();
    const headers: Record<string, string> = {};
    if (token) {
      console.log(token)
      headers['Authorization'] = `Token ${token}`;
    }
    const authReq = Object.keys(headers).length > 0 ? req.clone({ setHeaders: headers }) : req;
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.userService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
