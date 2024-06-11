import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../../modules/auth/services/auth.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
// import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
     private router: Router,
    //  private modal: NzModalService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();

    // Clone the request and set the new header only if condition is met
    let authReq = req;
    if (authToken) {
      this.checkTokenExpiration(authToken);
      authReq = req.clone({
        setHeaders: { Authorization: authToken },
        headers: req.headers.delete('X-Add-Authorization')
      });
    }

    // Send cloned request with header to the next handler
    return next.handle(authReq);
  }

  private checkTokenExpiration(token: string) {
    // Decode the token (assuming you have a function to decode JWT)
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp) {
        // Get the expiration timestamp
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    
      // Check if the token is expired
      if (Date.now() >= expirationTime) {
        // Token is expired, clear it from local storage
        localStorage.removeItem('authToken');
        this.router.navigate(['/auth/sign-in']);
        return false;
      }
    }
    return true;
  }
  
}
