import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CriaCifraPageRoutingModule } from './cria-cifra-routing.module';

import { CriaCifraPage } from './cria-cifra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CriaCifraPageRoutingModule
  ],
  declarations: [CriaCifraPage]
})
export class CriaCifraPageModule {}
