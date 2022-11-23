import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostCifraPage } from './post-cifra.page';

const routes: Routes = [
  {
    path: '',
    component: PostCifraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostCifraPageRoutingModule {}
