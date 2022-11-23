import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlidesIntroPageRoutingModule } from './slides-intro-routing.module';

import { SlidesIntroPage } from './slides-intro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlidesIntroPageRoutingModule
  ],
  declarations: [SlidesIntroPage]
})
export class SlidesIntroPageModule {}
