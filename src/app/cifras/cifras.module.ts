import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CifrasPageRoutingModule } from './cifras-routing.module';

import { CifrasPage } from './cifras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CifrasPageRoutingModule
  ],
  declarations: [CifrasPage]
})
export class CifrasPageModule {}
