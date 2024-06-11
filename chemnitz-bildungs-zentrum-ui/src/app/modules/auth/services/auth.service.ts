import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUserRequest } from '../model/register-user-request.model';
import { User } from '../../../shared/model/user.model';
import { ApiResponse } from '../model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiURL;
  constructor(private http: HttpClient) { }

  // TODO: any > response model
  userRegister(user: RegisterUserRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.baseUrl + '/register/', user);
  }

  userSignIn(email: string, password: string): Observable<ApiResponse<User>> {
      return this.http.post<ApiResponse<User>>(this.baseUrl + '/login', {
        email,
        password
    });
  }

  userSignOut(user: User): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.baseUrl + '/users/logout/', {})
  }

  getToken(): string {
    let token = localStorage.getItem('authToken');
    if (token) {
      return token;
    }
    return '';
  }

  refreshToken(token: string) {
    return this.http.post<ApiResponse<any>>(this.baseUrl + 'refreshToken', {token: token});
  }
}
