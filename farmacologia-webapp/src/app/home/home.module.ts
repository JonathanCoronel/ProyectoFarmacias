import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module'
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomePageComponent,
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        ReactiveFormsModule
    ]
})
export class HomeModule { }
