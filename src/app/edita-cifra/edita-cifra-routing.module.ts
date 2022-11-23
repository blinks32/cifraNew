import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditaCifraPage } from './edita-cifra.page';

const routes: Routes = [
  {
    path: '',
    component: EditaCifraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditaCifraPageRoutingModule {}
