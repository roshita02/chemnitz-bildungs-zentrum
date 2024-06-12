import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/model/user.model';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  currentUser!: User

  ngOnInit(): void {
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = plainToClass(User, JSON.parse(user));
    }
  }
    handleUserUpdate(user: User) {
      this.currentUser = user;
    }
}
