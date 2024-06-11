import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserGuard } from '../../shared/guards/user.guard';
import { UserAddressComponent } from './pages/user-address/user-address.component';
import { UserAccountComponent } from './pages/user-account/user-account.component';
import { FacilityMapSectionComponent } from './pages/facility-map-section/facility-map-section.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [UserGuard],
    children: [
      {
        path: 'profile',
        component: UserAccountComponent,
      },
      {
        path: '',
        component: FacilityMapSectionComponent,
        data: {
          breadcrumb: 'Dashboard'
        },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }
