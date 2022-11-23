import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DbCifrasPage } from './db-cifras.page';

const routes: Routes = [
  {
    path: '',
    component: DbCifrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DbCifrasPageRoutingModule {}
