import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaEstiloPageRoutingModule } from './lista-estilo-routing.module';
import { ListaEstiloPage } from './lista-estilo.page';
import {HttpClientModule} from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaEstiloPageRoutingModule,
    HttpClientModule,
    Ng2SearchPipeModule

  ],
  declarations: [ListaEstiloPage]
})
export class ListaEstiloPageModule {}
