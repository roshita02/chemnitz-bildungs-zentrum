import { AfterViewChecked, AfterViewInit, ApplicationRef, Component, ComponentFactoryResolver, ElementRef, EmbeddedViewRef, Injector, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import * as L from 'leaflet';
import { MainService } from '../../services/main.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { takeUntil } from 'rxjs';
import { subscribedContainerMixin } from '../../../../shared/subscribedContainer.mixin';
import { plainToClass } from 'class-transformer';
import { School } from '../../../../shared/model/school.model';
import { Kindergarden } from '../../../../shared/model/kindergarden.model';
import { SocialChildProject } from '../../../../shared/model/socialChildProject.model';
import { SocialTeenagerProject } from '../../../../shared/model/socialTeenagerProject.model';
import { FacilityPopupComponent } from '../../shared/components/facility-popup/facility-popup.component';
import { User } from '../../../../shared/model/user.model';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserAddressComponent } from '../user-address/user-address.component';
import 'leaflet.markercluster';
import { UserService } from '../../shared/services/user.service';

interface MarkerData {
  id: string;
  name: string;
  // Add any other properties as needed
}
@Component({
  selector: 'app-facility-map-section',
  templateUrl: './facility-map-section.component.html',
  styleUrl: './facility-map-section.component.scss'
})
export class FacilityMapSectionComponent extends subscribedContainerMixin() implements AfterViewInit, AfterViewChecked {
    errorMessage!: string;
    selectedFacility!: string;
    listOfFacilities: Array<string> = [];
    listOfFacilitiesOption: Array<string> = ['Kindergarden', 'School','Social Child Projects', 'Social Teenager Projects'];
    private map!: L.Map;
    private centroid: L.LatLngExpression = [50.833332, 12.916667]; 
    schoolsList: School[] = [];
    kindergardenList: Kindergarden[] = [];
    socialChildProjectList: SocialChildProject[] = [];
    socialTeenagerProjectList: SocialTeenagerProject[] = [];
    markersList: Array<L.Marker> = [];
    previousSelectedOptions: Array<string> = [];

    schoolMarkerList: Array<L.Marker> = [];
    kindergardenMarkerList: Array<L.Marker> = [];
    socialChildProjectMarkerList: Array<L.Marker> = [];
    socialTeenagerProjectsMarkerList: Array<L.Marker> = [];
    schoolWithSchoolTypeMarkerList: any = {};

    kindergardenMarkerCursorGroup!: L.MarkerClusterGroup;
    socialChildProjectMarkerCursorGroup!: L.MarkerClusterGroup;
    socialTeenagerProjectsMarkerCursorGroup!: L.MarkerClusterGroup;
    schoolWithSchoolTypeMarkerCursorGroup!: L.MarkerClusterGroup;


    popupFacility: any;
    currentUser!: User;
    currentUserId!: string;
    private markers: { marker: L.Marker, data: MarkerData }[] = [];
    homeAddressMarker?: L.Marker;

    // School filter options values
    showSchool: boolean = false;
    schoolFilterOptions: Array<any> = [];
    listOfSchools: Array<string> = [];
    previousSelectedSchoolOptions: Array<string> = [];

    bounds = L.latLngBounds([]);

    homeaddressplaceholder!: string;
    facilityFilterOptions: Array<{ label: string; value: string }> = [
      {
        label: 'Kindergarten',
        value: 'kindergardens'
      },
      {
        label: 'School',
        value: 'schools'
      },
      {
        label: 'Social Child Project',
        value: 'socialChildProjects'
      },
      {
        label: 'Social Teenager Project',
        value: 'socialTeenagerProjects'
      },
    ];

    constructor(private mainService: MainService,
      private notification: NzNotificationService,
      private viewContainerRef: ViewContainerRef,
      private modal: NzModalService,
      private injector: Injector,
      private appRef: ApplicationRef,
      private el: ElementRef,
      private renderer: Renderer2,
      private userService: UserService
    ) {
        super();
        let user = localStorage.getItem('currentUser');
        if (user) {
          this.currentUser = plainToClass(User, JSON.parse(user));
          this.currentUserId = this.currentUser._id || '';
          this.homeaddressplaceholder = this.currentUser.address?.street || '';
        }
        if (!this.homeaddressplaceholder) {
            this.homeaddressplaceholder = 'Please set your home address';
        }
    }

    private initMap(): void {
      this.map = L.map('map', {
        center: this.centroid,
        zoom: 12
      });

      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 10,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      tiles.addTo(this.map);
      this.addHomeMarker();
    }

    addHomeMarker(): void {
      let address = this.currentUser?.address;
      if (address && address.lat && address.lon) {
        this.homeAddressMarker = L.marker([address.lat, address.lon], {
          icon: new L.Icon({
            iconSize: [48, 48],
            iconAnchor: [13, 41],
            iconUrl: 'assets/img/marker-home.png',
          })
        });
        this.homeAddressMarker.addTo(this.map);
        this.map.setView(this.homeAddressMarker.getLatLng(), 20);
        this.bounds.extend(this.homeAddressMarker.getLatLng());
        this.map.fitBounds(this.bounds);
      }
    }

    stateChange(value: string): void {
      // ();
    }

    ngAfterViewInit() {
      this.initMap();
    }

    facilitiesCount(): string {
      var count = 0;
      if (this.map){
        this.map.eachLayer(function(layer) {
          if (layer instanceof L.Marker) {
              count++;
          }
        });
        if (count == 0) {
          return '';
        }
        return count.toString();
      } 
      return '';
    }

    plotSchoolList(){
      this.mainService.getSchoolsList().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res.success) {
          this.schoolsList = res.data || [];
          this.showSchool = true;
          this.schoolsList.forEach(data => {
            let school = plainToClass(School, data)
            const marker = L.marker([school.Y, school.X], {
              icon: new L.Icon({
                iconSize: [28, 28],
                iconAnchor: [13, 41],
                iconUrl: 'assets/img/blue-marker.png',
              })
            });
            marker.on('click', (event) => {
              this.onMarkerClick(event, 'school', data._id);
            });
            marker.addTo(this.map);
            this.schoolMarkerList.push(marker);

            // For filtering by school type
            if (data.ART && !this.schoolFilterOptions.includes(data.ART)) {
              this.schoolFilterOptions.push(data.ART);
              if (!this.listOfSchools.includes(data.ART)) {
                this.listOfSchools.push(data.ART);
              }
            }
          })
        }
      })
    }

    plotSchoolTypeList(schoolType: string) {
      this.mainService.getSchoolWithSchoolTypeList(schoolType).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if(res.success) {
          this.schoolsList = res.data || [];
          this.showSchool = true;
          if (!this.schoolWithSchoolTypeMarkerCursorGroup) {
            this.schoolWithSchoolTypeMarkerCursorGroup = L.markerClusterGroup({
              maxClusterRadius: 80,
              disableClusteringAtZoom: 20,
              iconCreateFunction: (cluster: L.MarkerCluster): L.DivIcon => this.createClusterCustomIcon(cluster, 'school')
            });
          }
          this.schoolsList.forEach(data => {
            let school = plainToClass(School, data)
            const marker = L.marker([school.Y, school.X], {
              icon: new L.Icon({
                iconSize: [28, 28],
                iconAnchor: [13, 41],
                iconUrl: 'assets/img/blue-marker.png',
              })
            });
            marker.on('click', (event) => {
              this.onMarkerClick(event, 'school', data._id);
            });
            this.schoolWithSchoolTypeMarkerCursorGroup.addLayer(marker);

            if (!this.schoolWithSchoolTypeMarkerList[schoolType]) {
              this.schoolWithSchoolTypeMarkerList[schoolType] = [marker];
            } else if(this.schoolWithSchoolTypeMarkerList[schoolType]) {
              this.schoolWithSchoolTypeMarkerList[schoolType].push(marker);
            }

            if (data.ART && !this.schoolFilterOptions.includes(data.ART)) {
              this.schoolFilterOptions.push(data.ART);
              if (!this.listOfSchools.includes(data.ART)) {
                this.listOfSchools.push(data.ART);
              }
            }
          })
         
          this.map.addLayer(this.schoolWithSchoolTypeMarkerCursorGroup);
          this.map.fitBounds( this.schoolWithSchoolTypeMarkerCursorGroup.getBounds());
        }
      })
    }

    plotKindergardensList(){
      this.mainService.getKindergardensList().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res.success) {
          this.kindergardenList = res.data || [];
          this.kindergardenMarkerCursorGroup = L.markerClusterGroup({
            maxClusterRadius: 80,
            iconCreateFunction: (cluster: L.MarkerCluster): L.DivIcon => this.createClusterCustomIcon(cluster, 'kindergarden')
          });
          this.kindergardenList.forEach(data => {
            let kindergarden = plainToClass(Kindergarden, data)
            const marker = L.marker([kindergarden.Y, kindergarden.X], {
              icon: new L.Icon({
                iconSize: [28, 28],
                iconAnchor: [13, 41],
                iconUrl: 'assets/img/orange-map-marker.png',
              })
            });
            marker.on('click', (event) => {
              this.onMarkerClick(event, 'kindergarden', data._id);
            });
            this.kindergardenMarkerCursorGroup.addLayer(marker);
          })
          this.map.addLayer(this.kindergardenMarkerCursorGroup);
          this.map.fitBounds(this.kindergardenMarkerCursorGroup.getBounds());
        }
      })
    }

    plotSocialChildProjectsList(){
      this.mainService.getSocialChildProjectsList().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res.success) {
          this.socialChildProjectList = res.data || [];
          this.socialChildProjectMarkerCursorGroup = L.markerClusterGroup({
            maxClusterRadius: 80,
            iconCreateFunction: (cluster: L.MarkerCluster): L.DivIcon => this.createClusterCustomIcon(cluster, 'socialChildProject')
          });
          this.socialChildProjectList.forEach(data => {
            let socialChildProject = plainToClass(SocialChildProject, data)
            const marker = L.marker([socialChildProject.Y, socialChildProject.X], {
              icon: new L.Icon({
                iconSize: [28, 28],
                iconAnchor: [13, 41],
                iconUrl: 'assets/img/pink-map-marker.png',
              })
            });
            marker.on('click', (event) => {
              this.onMarkerClick(event, 'socialChildProject', data._id);
            });
            this.socialChildProjectMarkerCursorGroup.addLayer(marker);
          })
          this.map.addLayer(this.socialChildProjectMarkerCursorGroup);
          this.map.fitBounds(this.socialChildProjectMarkerCursorGroup.getBounds());
        }
      })
    }

    plotSocialTeenagerrojectsList(){
      this.mainService.getSocialTeenagerProjectsList().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res.success) {
          this.socialTeenagerProjectList = res.data || [];
          this.socialTeenagerProjectsMarkerCursorGroup = L.markerClusterGroup({
            maxClusterRadius: 80,
            disableClusteringAtZoom: 16,
            iconCreateFunction: (cluster: L.MarkerCluster): L.DivIcon => this.createClusterCustomIcon(cluster, 'socialTeenagerProject')
          });
          this.socialTeenagerProjectList.forEach(data => {
            let socialTeenagerProject = plainToClass(SocialTeenagerProject, data)
            const marker = L.marker([socialTeenagerProject.Y, socialTeenagerProject.X], {
              icon: new L.Icon({
                iconSize: [28, 28],
                iconAnchor: [13, 41],
                iconUrl: 'assets/img/purple-map-marker.png',
              }),
            });
            marker.on('click', (event) => {
              this.onMarkerClick(event, 'socialTeenagerProject', data._id);
            });
            this.socialTeenagerProjectsMarkerCursorGroup.addLayer(marker);
          })
          this.map.addLayer(this.socialTeenagerProjectsMarkerCursorGroup);
          this.map.fitBounds(this.socialTeenagerProjectsMarkerCursorGroup.getBounds());
        }
      })
    }

    plotChanges(event: Array<string>):void {
      const added = event.filter(option => !this.previousSelectedOptions.includes(option));
      const removed = this.previousSelectedOptions.filter(option => !event.includes(option));
  
      if (added.length > 0) {
        switch (added[0]) {
          case 'schools':
            this.getSchoolTypeList();
            break;
          case 'kindergardens':
            this.plotKindergardensList();
            break;
          case 'socialChildProjects':
            this.plotSocialChildProjectsList();
            break;
          case 'socialTeenagerProjects':
            this.plotSocialTeenagerrojectsList();
            break;
        }
      }
      if (removed.length > 0) {
        switch (removed[0]) {
          case 'schools':
            this.listOfSchools = [];
            this.showSchool = false;
            if (this.schoolWithSchoolTypeMarkerCursorGroup) {
              this.map.removeLayer(this.schoolWithSchoolTypeMarkerCursorGroup);
            }
            break;
          case 'kindergardens':
            this.map.removeLayer(this.kindergardenMarkerCursorGroup);
            break;
          case 'socialChildProjects':
            this.map.removeLayer(this.socialChildProjectMarkerCursorGroup);
            break;
          case 'socialTeenagerProjects':
            this.map.removeLayer(this.socialTeenagerProjectsMarkerCursorGroup);
            break;
        }
      }
      this.previousSelectedOptions = [...event];
    }

    getSchoolTypeList(): void {
      this.mainService.getSchoolTypeList().pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res.success) {
          this.schoolFilterOptions = res.data || [];
          this.showSchool = true;
        }
      });
    }

    plotSchoolChanges(event: Array<string>): void {
      const added = event.filter(option => !this.previousSelectedSchoolOptions.includes(option));
      const removed = this.previousSelectedSchoolOptions.filter(option => !event.includes(option));
      if (added.length > 0) {
        let addedFacilityType = added[0];
        this.plotSchoolTypeList(addedFacilityType);
      }
      if (removed.length > 0) {
        let removedFacilityType = removed[0];
        if (this.schoolWithSchoolTypeMarkerCursorGroup && this.schoolWithSchoolTypeMarkerList[removedFacilityType]) {
          this.schoolWithSchoolTypeMarkerList[removedFacilityType].forEach((marker: L.Layer) => {
            if (this.schoolWithSchoolTypeMarkerCursorGroup.hasLayer(marker)) {
              this.schoolWithSchoolTypeMarkerCursorGroup.removeLayer(marker);
            }
          })
        };
      }
      this.previousSelectedSchoolOptions = [...event];
    }


    onMarkerClick(event: L.LeafletMouseEvent, type: string, id: string): void {
      this.popupFacility = {};
      switch (type) {
        case 'school':
          this.mainService.getSchool(id, this.currentUserId).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.success) {
              this.popupFacility = res.data;
              this.showPopup(event.target, this.popupFacility);
            }
          });
          break;
        case 'kindergarden':
          this.mainService.getKindergarden(id, this.currentUserId).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.success) {
              this.popupFacility = res.data;
              this.showPopup(event.target, this.popupFacility);
            }
          });
          break;
        case 'socialChildProject':
          this.mainService.getSocialChildProject(id, this.currentUserId).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.success) {
              this.popupFacility = res.data;
              this.showPopup(event.target, this.popupFacility);
            }
          });
          break;
        case 'socialTeenagerProject':
          this.mainService.getSocialTeenagerProject(id, this.currentUserId).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res.success) {
              this.popupFacility = res.data;
              this.showPopup(event.target, this.popupFacility);
            }
          });
          break;
      }
    }

    showPopup(marker: L.Marker, data: any) {
      const component = this.viewContainerRef.createComponent(FacilityPopupComponent);
      component.instance.data = data;
      component.instance.isFavourite = data.isFavourite;
      const domElem = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      component.onDestroy(() => {
        this.appRef.detachView(component.hostView);
      });
      if (component.instance.data) {
        marker.bindPopup(domElem).openPopup();
      }
    }

    editAddress() {
      const modal = this.modal.create({
        nzWidth: '768px',
        nzTitle: 'Update your home address',
        nzContent: UserAddressComponent,
        nzViewContainerRef: this.viewContainerRef,
        nzOnOk: () => new Promise((resolve) => setTimeout(resolve, 1000)),
      });
      modal.afterClose.subscribe((result) => {
        if (result && result.address) {
          this.homeaddressplaceholder = result.address.street;
          this.currentUser.address = result.address;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.userService.setUser(this.currentUser);
        }
        if (result) {
          if (this.homeAddressMarker) {
            this.map.removeLayer(this.homeAddressMarker);
          }
          this.addHomeMarker();
          
          this.notification.create(
            result.success ? 'success' : 'error',
            result.success ? 'Success' : 'Error',
            result.message,
            { nzPlacement: 'bottomLeft' }
          );
        }
      });
    }

    onOpenChange(open: boolean): void {
    }

    onTagsChange(): void {
      this.applyTagClasses();
    }
    ngAfterViewChecked(): void {
      this.applyTagClasses();
    }

    applyTagClasses(): void {
      const tags = this.el.nativeElement.querySelectorAll('.ant-select-selection-item');
      tags.forEach((tag: HTMLElement) => {
        const tagValue = tag.innerText.trim().toLowerCase();
        this.renderer.removeClass(tag, 'school');
        this.renderer.removeClass(tag, 'kindergarden');
        this.renderer.removeClass(tag, 'socialChildProject');
        this.renderer.removeClass(tag, 'socialTeenagerProject');
  
        switch (tagValue) {
          case 'school':
            this.renderer.addClass(tag, 'school');
            break;
          case 'kindergarten':
            this.renderer.addClass(tag, 'kindergarden');
            break;
          case 'social child project':
            this.renderer.addClass(tag, 'socialChildProject');
            break;
          case 'social teenager project':
            this.renderer.addClass(tag, 'socialTeenagerProject');
            break;
          default:
            this.renderer.addClass(tag, 'tag-default');
            break;
        }
      });
    }

    private createClusterCustomIcon(cluster: L.MarkerCluster, type: string): L.DivIcon {
      const count = cluster.getChildCount();
      let color = 'blue'; // Default color
  
      switch (type) {
       
        case 'kindergarden':
          color = '#fe7e0f';
          break;
        case 'socialChildProject':
          color='#FF5768';
          break;
        case 'socialTeenagerProject':
          color='#8e3ccb';
          break;
        case 'school':
          color='#0078FF';
          break;
      }
  
      return L.divIcon({
        html: `<div style="background-color:${color};"><span>${count}</span></div>`,
        className: 'marker-cluster',
        iconSize: L.point(40, 40)
      });
    }
}


