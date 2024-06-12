// user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../../../shared/model/user.model';
import { plainToClass } from 'class-transformer';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());

  getUser() {
    return this.userSubject.asObservable();
  }

  setUser(newUser: User) {
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.userSubject.next(newUser);
  }

  private getUserFromLocalStorage(): any {
    let user = localStorage.getItem('currentUser');
    if (user) {
      return plainToClass(User, JSON.parse(user));
    }
    return null;
    
  }
}
