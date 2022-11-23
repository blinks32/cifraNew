import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DbCifrasPageRoutingModule } from './db-cifras-routing.module';

import { DbCifrasPage } from './db-cifras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DbCifrasPageRoutingModule
  ],
  declarations: [DbCifrasPage]
})
export class DbCifrasPageModule {}
