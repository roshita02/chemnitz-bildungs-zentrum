import { NgModule } from "@angular/core";
import { MainRoutingModule } from "./main.routing";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NavBarComponent } from "./shared/components/nav-bar/nav-bar.component";
import { HomeComponent } from "./pages/home/home.component";
import { FacilityInfoComponent } from "./pages/facility-info/facility-info.component";
import { FacilityMapSectionComponent } from "./pages/facility-map-section/facility-map-section.component";
import { FacilityPopupComponent } from "./shared/components/facility-popup/facility-popup.component";
import { FavouriteFacilityComponent } from "./pages/favourite-facility/favourite-facility.component";
import { UserAccountComponent } from "./pages/user-account/user-account.component";
import { UserAddressComponent } from "./pages/user-address/user-address.component";
import { IconModule } from "./shared/icons/icon.module";
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from "ng-zorro-antd/form";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzMessageModule } from "ng-zorro-antd/message";
import { AuthRoutingModule } from "../auth/auth.routing";
import { NzNotificationModule } from "ng-zorro-antd/notification";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { UpdateUserAccountModalComponent } from "./pages/update-user-account-modal/update-user-account-modal.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
@NgModule({
    imports: [
        MainRoutingModule,
        CommonModule,
        FormsModule,
        NzModalModule,
        NzDropDownModule,
        NzAvatarModule,
        NzIconModule,
        NzCardModule,
        NzSelectModule,
        IconModule,
        NzInputModule,
        NzDividerModule,
        LeafletModule,
        ReactiveFormsModule,
        NzGridModule,
        CommonModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzAlertModule,
        NzMessageModule,
        AuthRoutingModule,
        NzNotificationModule,
        ReactiveFormsModule,
        NzCheckboxModule,
        NzCardModule,
        NzToolTipModule
    ],
    declarations: [
        FacilityInfoComponent,
        FacilityMapSectionComponent,
        FacilityPopupComponent,
        FavouriteFacilityComponent,
        HomeComponent,
        UserAccountComponent,
        UserAddressComponent,
        UpdateUserAccountModalComponent,
        NavBarComponent,
        FooterComponent
    ]
})
export class MainModule {}