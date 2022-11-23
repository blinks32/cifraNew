import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CifrasPage } from './cifras.page';

const routes: Routes = [
  {
    path: '',
    component: CifrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CifrasPageRoutingModule {}
