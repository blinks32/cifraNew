import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlidesIntroPage } from './slides-intro.page';

const routes: Routes = [
  {
    path: '',
    component: SlidesIntroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlidesIntroPageRoutingModule {}
