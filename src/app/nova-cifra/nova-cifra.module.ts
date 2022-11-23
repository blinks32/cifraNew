import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NovaCifraPageRoutingModule } from './nova-cifra-routing.module';

import { NovaCifraPage } from './nova-cifra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NovaCifraPageRoutingModule
  ],
  declarations: [NovaCifraPage]
})
export class NovaCifraPageModule {}
