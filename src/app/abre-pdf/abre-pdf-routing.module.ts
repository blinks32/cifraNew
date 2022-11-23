import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AbrePdfPage } from './abre-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: AbrePdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbrePdfPageRoutingModule {}
