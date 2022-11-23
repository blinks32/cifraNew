import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CriaCifraPage } from './cria-cifra.page';

const routes: Routes = [
  {
    path: '',
    component: CriaCifraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CriaCifraPageRoutingModule {}
