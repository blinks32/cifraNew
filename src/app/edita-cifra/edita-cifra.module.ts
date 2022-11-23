import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditaCifraPageRoutingModule } from './edita-cifra-routing.module';

import { EditaCifraPage } from './edita-cifra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditaCifraPageRoutingModule
  ],
  declarations: [EditaCifraPage]
})
export class EditaCifraPageModule {}
