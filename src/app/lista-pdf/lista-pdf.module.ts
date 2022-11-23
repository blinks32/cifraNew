import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPdfPageRoutingModule } from './lista-pdf-routing.module';

import { ListaPdfPage } from './lista-pdf.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPdfPageRoutingModule,
    Ng2SearchPipeModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule
  ],
  declarations: [ListaPdfPage]

})
export class ListaPdfPageModule {}
