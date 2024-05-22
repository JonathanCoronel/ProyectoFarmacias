import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';


@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    IsAuthenticatedGuard,
  ],
  declarations: []
})
export class CoreModule { }
