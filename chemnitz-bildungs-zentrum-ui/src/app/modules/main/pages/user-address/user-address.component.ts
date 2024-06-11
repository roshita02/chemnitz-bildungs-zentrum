import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { subscribedContainerMixin } from '../../../../shared/subscribedContainer.mixin';
import Geocoder from 'leaflet-control-geocoder';
import 'leaflet-search';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { User } from '../../../../shared/model/user.model';
import { plainToClass } from 'class-transformer';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HttpClient } from '@angular/common/http';
import { MainService } from '../../services/main.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { switchMap, takeUntil } from 'rxjs';
@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrl: './user-address.component.scss'
})
export class UserAddressComponent extends subscribedContainerMixin() implements AfterViewInit{
  private map1!: L.Map;
  private centroid: L.LatLngExpression = [50.833332, 12.916667];
  private marker!: L.Marker;
  currentUser!: User;
  currentUserId: string = '';
  editingAddress!: boolean;
  address_input: string = '';

  constructor(private modal: NzModalRef,private http: HttpClient, private mainService: MainService, private notificationService: NzNotificationService) {
    super();
    let user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = plainToClass(User, JSON.parse(user));
      this.currentUserId = plainToClass(User, JSON.parse(user))._id || '';
    }
  }

  private initMap(): void {
    this.map1 = L.map('map1', {
      center: this.centroid,
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map1);
    let centroid = L.latLng(50.83378900698935, 12.916123867034914);
    let userAddress = this.currentUser?.address
    if (userAddress && userAddress.lat && userAddress.lon) {
      centroid =  L.latLng(userAddress.lat, userAddress.lon);
    }
    this.marker = L.marker( centroid, {
      draggable: true,
      icon: new L.Icon({
        iconSize: [48, 48],
        iconAnchor: [13, 41],
        iconUrl: 'assets/img/marker-home.png',
      })
    }).addTo(this.map1);

    this.marker.on('dragend', (event) => {
      const position = (event.target as L.Marker).getLatLng();
    });

    const geocoder = new Geocoder({
      defaultMarkGeocode: false
    })
    .on('markgeocode', (e: any) => {
      const center = e.geocode.center;
      this.map1?.setView(center, 13);
      if (this.marker) {
        this.marker.setLatLng(center);
      } else {
        this.marker = L.marker(center, { draggable: true }).addTo(this.map1);
      }
    }).addTo(this.map1);
  }

  ngAfterViewInit() {
    this.initMap();
  }

  cancel(): void {
    this.modal.close();
  }

  updateUserAddress() {
    const markerLatLng = this.marker.getLatLng();
    const latitude = markerLatLng.lat;
    const longitude = markerLatLng.lng;
    const url1 = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    this.http.get<any>(url1).pipe(
      takeUntil(this.destroyed$),
      switchMap(response1 => {
        // Process the first API response
        if (response1 && response1.address && response1.address?.road) {
          this.address_input = response1.address?.road;
          if (response1.address?.house_number) {
            this.address_input = this.address_input + ' ' + response1.address?.house_number;
          }
        } else if (response1.name) {
          this.address_input = response1.name;
        } else {
          this.address_input = '';
        }
        // Return the observable for the second API call
        return this.mainService.updateUserAddress(this.currentUserId, {lat: latitude, lon: longitude, street: this.address_input});
      })
    ).subscribe(
      (res)=> {
        if (res.success) {
          this.modal.close({
            success: true,
            message: 'Address updated successfully',
            address: res.data
          });
        } else {
          this.modal.close({
            success: false,
            message:
              res.message ?? `Error updating address.`,
          });
        }
      }, (err) => {
        this.modal.close({
          success: false,
          message:
            `Error updating address.`,
        });
      }
    );
  }

  getAddressFromLatLng(latitude: number, longitude: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    let ad = '';
    this.http.get<any>(url).subscribe(
      (response) => {
        if (response && response.address) {
          this.address_input = response.address.road + ' ' + response.address.house_number;
        } else if(response.name) {
          this.address_input = response.name;
        }
      },
      (error) => {
        this.address_input = ''
      }
    );
  }

}
