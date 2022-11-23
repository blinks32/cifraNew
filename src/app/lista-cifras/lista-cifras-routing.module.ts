import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaCifrasPage } from './lista-cifras.page';

const routes: Routes = [
  {
    path: '',
    component: ListaCifrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaCifrasPageRoutingModule {}
