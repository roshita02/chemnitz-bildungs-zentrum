import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
          import('./modules/auth/auth.module').then((mod) => mod.AuthModule),
    },
    {
      path: '',
      loadChildren: () =>
        import('./modules/main/main.module').then((mod) => mod.MainModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}