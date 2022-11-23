import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NovaCifraPage } from './nova-cifra.page';

const routes: Routes = [
  {
    path: '',
    component: NovaCifraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NovaCifraPageRoutingModule {}
