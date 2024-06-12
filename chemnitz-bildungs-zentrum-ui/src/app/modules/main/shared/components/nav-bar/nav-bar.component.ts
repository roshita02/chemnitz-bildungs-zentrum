import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { plainToClass } from 'class-transformer';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../../../shared/model/user.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { subscribedContainerMixin } from '../../../../../shared/subscribedContainer.mixin';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent extends subscribedContainerMixin() implements OnInit, OnDestroy {
  navbarOpen = false;
  currentUser!: User;
  isSignOutModalVisible = false;

  private userSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NzNotificationService,
    private userService: UserService,
  ) {
    super(); 
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = plainToClass(User, JSON.parse(user));
    }
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.getUser().subscribe(
      (user: User) => {
        this.currentUser = plainToClass(User, user);
      }
    );
  }

 

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  getUserName(): string {
    if (this.currentUser) {
      return this.toTitleCase(this.currentUser.firstName + ' ' + this.currentUser.lastName);
    } else {
      return 'User';
    }
  }

  signOut(): void {
    this.authService.userSignOut(this.currentUser)
    .pipe(takeUntil(this.destroyed$))
    .subscribe(() => {
      this.notification.create(
        'success',
        'Sign Out Successful',
        'You have been successfully signed out.',
        { nzPlacement: 'bottomLeft' }
      );
      localStorage.clear();
      this.router.navigate(['/auth/sign-in']);
    });
  }

  showSignOutConfirmModal(): void {
    this.isSignOutModalVisible = true;
  }

  signOutOk(): void {
    this.signOut();
    this.isSignOutModalVisible = false;
  }

  signOutCancel(): void {
    this.isSignOutModalVisible = false;
  }

  gotoProfile(): void {
    if (this.navbarOpen) {
      this.navbarOpen = false;
    }
    this.router.navigate(['/profile']);
  }

  toTitleCase(str: string): string {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
  } 

  override ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
