import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPdfPage } from './lista-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPdfPageRoutingModule {}
