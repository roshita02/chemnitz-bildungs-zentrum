import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { subscribedContainerMixin } from '../../../../shared/subscribedContainer.mixin';
import { User } from '../../../../shared/model/user.model';
import { plainToClass } from 'class-transformer';
import { Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UpdateUserAccountModalComponent } from '../update-user-account-modal/update-user-account-modal.component';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent implements OnInit {
  currentUser!: User;
  isDeleteModalVisible: boolean = false;

  constructor(
    private router: Router,
    private mainService: MainService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef
  ) {
    // super();
  }

  ngOnInit(): void {
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = plainToClass(User, JSON.parse(user));
      // this.cdr.detectChanges(); 
    }
  }

  editUserDetails(): void {
    const modal = this.modal.create({
      nzWidth: '768px',
      nzTitle: 'Update your profile',
      nzContent: UpdateUserAccountModalComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
    });
    modal.afterClose.subscribe((result) => {
      if (result) {
        this.notification.create(
          result.success ? 'success' : 'error',
          result.success ? 'Success' : 'Error',
          result.message,
          { nzPlacement: 'bottomLeft' }
        );
        this.currentUser = plainToClass(User, JSON.parse(result.data));
      }
    });
  }

  getUser(): void {
    this.mainService.getUser(this.currentUser._id || '').subscribe((res) => {
      if (res.success && res.data){
        let user = JSON.stringify(res.data);
        localStorage.setItem('currentUser', user);
        this.currentUser = plainToClass(User, user);
      }
    })
  }

  goback(): void {
    this.router.navigate(['/']);
  }

  openDeleteModal(): void {
    this.isDeleteModalVisible = true;
  }

  deleteCancel(): void {
    this.isDeleteModalVisible = false;
  }

  deleteOk(): void {
    this.deleteAccount();
    this.isDeleteModalVisible = false;
  }

  deleteAccount(): void {
    this.mainService.deleteUser(this.currentUser._id || '')
    .subscribe(() => {
      this.notification.create(
        'success',
        'Delete Account Successful',
        '',
        { nzPlacement: 'bottomLeft' }
      );
      localStorage.clear();
      this.router.navigate(['/auth/sign-in']);
    })
  }
}
