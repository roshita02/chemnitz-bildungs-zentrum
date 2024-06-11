import { Component, Input, OnInit } from '@angular/core';
import { subscribedContainerMixin } from '../../../../../shared/subscribedContainer.mixin';
import { MainService } from '../../../services/main.service';
import { User } from '../../../../../shared/model/user.model';
import { plainToClass } from 'class-transformer';
import { takeUntil } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as L from 'leaflet';
import { Address } from '../../../../../shared/model/address.model';

@Component({
  selector: 'app-facility-popup',
  templateUrl: './facility-popup.component.html',
  styleUrl: './facility-popup.component.scss'
})
export class FacilityPopupComponent extends subscribedContainerMixin() implements OnInit {
  @Input() data: any;
  @Input() isFavourite!: boolean;
  currentUser!: User;
  currentUserAddress!: Address;

  ngOnInit(): void {
  }

  constructor(
    private mainService: MainService,
    private notification: NzNotificationService
  ) {
    super();
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = plainToClass(User, JSON.parse(user));
      if (this.currentUser.address) {
        this.currentUserAddress = this.currentUser.address;
      }
    }
  }

  calculateDistance(): string {
    if (this.currentUserAddress && this.currentUserAddress.lat && this.currentUserAddress.lon){
      const pointA = L.latLng(this.data.lat, this.data.lon);
      const pointB = L.latLng(this.currentUserAddress.lat, this.currentUserAddress.lon);
      const distance = (pointA.distanceTo(pointB) / 1000).toFixed(2); // in meters
      return distance + ' km';
    }
    return '';
  }

  getLatLong(): string {
    if (this.data.lat && this.data.lon) {
      return "Latitude: " + this.data.lat + '°, Longitude: ' + this.data.lon + "°"; 
    }
    return "";
  }

  facilityType(): string {
    let facilityType = this.data.facilityType;
    if (facilityType == 'socialChildProject') {
      return 'Social Child Project';
    } else  if (facilityType == 'socialTeenagerProject') {
      return 'Social Teenager Project';
    }
    return this.data.facilityType;
  }

  toggleFavorite(): void {
    let currentUserId = this.currentUser._id || '';
    if(this.isFavourite) {
      this.mainService.deleteUserFavourite(currentUserId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res.success){
          this.isFavourite = false;
          this.currentUser.favouriteFacility = null;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.mainService.updatedUser();
          this.notification.create(
            'success',
            'Removed from Favourite',
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
    } else {
      this.mainService.addUserFavourite(currentUserId, this.data.facilityId, this.data.facilityType, this.data.name, this.data.address)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        if (res.success){
          this.isFavourite = true;
          this.currentUser.favouriteFacility = res.data;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.mainService.updatedUser();
          this.notification.create(
            'success',
            'Marked as Favourite',
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
        this.notification.create('error', 'Error', 'Error marking from favourite', {
          nzPlacement: 'bottomLeft',
        });
      })
    }
  }

  goToLink(link: string) {
    window.open(link, '_blank');
  }
}
