import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthenticatedGuard } from './core/guards/is-authenticated.guard';

const routes: Routes = [
  // ruta base, redirige al inicio de sesión
  { path: '', redirectTo: 'liv-home', pathMatch: 'full' },

  {
    // ruta inicio de sesión
    path: 'course',
    loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
    canActivate: [IsAuthenticatedGuard],
  },
  {
    // ruta inicio de sesión
    path: 'liv-home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [],
  }, {
    // re-dirección por defecto
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    // ruta test
    path: 'test',
    loadChildren: () => import('./test/test.module').then(m => m.TestModule),
    canActivate: [],
  },

  {
    path: 'ingresar',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
