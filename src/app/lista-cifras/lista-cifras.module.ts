import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaCifrasPageRoutingModule } from './lista-cifras-routing.module';

import { ListaCifrasPage } from './lista-cifras.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaCifrasPageRoutingModule,
    Ng2SearchPipeModule

  ],
  declarations: [ListaCifrasPage]
})
export class ListaCifrasPageModule {}
