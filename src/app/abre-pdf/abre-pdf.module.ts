import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AbrePdfPageRoutingModule } from './abre-pdf-routing.module';

import { AbrePdfPage } from './abre-pdf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AbrePdfPageRoutingModule
  ],
  declarations: [AbrePdfPage]
})
export class AbrePdfPageModule {}
