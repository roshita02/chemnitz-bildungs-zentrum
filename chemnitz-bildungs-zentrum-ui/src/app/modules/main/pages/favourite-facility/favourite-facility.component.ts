import { Component, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { User } from '../../../../shared/model/user.model';
import { MainService } from '../../services/main.service';
import { subscribedContainerMixin } from '../../../../shared/subscribedContainer.mixin';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-favourite-facility',
  templateUrl: './favourite-facility.component.html',
  styleUrl: './favourite-facility.component.scss'
})
export class FavouriteFacilityComponent extends subscribedContainerMixin() implements OnInit {
  favouriteFacility!: any;
  currentUser!: User;
  currentUserId!: string;
  isDeleteModalVisible: boolean = false;

  constructor(private mainService: MainService, 
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {
    super();
  }


  ngOnInit(): void {
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = plainToClass(User, JSON.parse(user));
      this.currentUserId = this.currentUser._id || '';
      this.favouriteFacility = this.currentUser.favouriteFacility;
    }
    this.mainService.userChangedObs.subscribe((res) => {
        let user = localStorage.getItem('currentUser');
        if (user) {
          this.currentUser = plainToClass(User, JSON.parse(user));
          this.currentUserId = this.currentUser._id || '';
          this.favouriteFacility = this.currentUser.favouriteFacility;
        }
    })
  }

  openRemoveFavouriteModal(): void {
    this.isDeleteModalVisible = true;
  }

  deleteCancel(): void {
    this.isDeleteModalVisible = false;
  }

  deleteOk(): void {
    this.removeFromFavourites();
    this.isDeleteModalVisible = false;
  }

  removeFromFavourites(): void {
    this.mainService.deleteUserFavourite(this.currentUser._id || '')
    .subscribe((res) => {
      if (res.success) {
        this.currentUser.favouriteFacility = null;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.mainService.updatedUser();
        this.notification.create(
          'success',
          'Removed From Favourites',
          '',
          { nzPlacement: 'bottomLeft' }
        );
      } else if (!res.success  && res.message){
        this.notification.create(
          'error',
          'Error',
          res.message,
          { nzPlacement: 'bottomLeft' }
        );
      }
    }, err => {
      this.notification.create('error', 'Error', 'Error removing from favourite', {
        nzPlacement: 'bottomLeft',
      });
    })
  }
}
