import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignedUserComponent } from './components/signed-user/signed-user.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  imports: [
    CommonModule,
    CKEditorModule,
    MatChipsModule,
    MatFormFieldModule,
    CarouselModule,
  ],
  declarations: [
    NavbarComponent,
    SignedUserComponent
  ],
  exports: [
    NavbarComponent,
    CKEditorModule,
    SignedUserComponent,
    MatChipsModule,
    MatFormFieldModule,
    CarouselModule
  ]
})
export class SharedModule { }
