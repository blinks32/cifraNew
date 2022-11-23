import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripePayPage } from './stripe-pay.page';

const routes: Routes = [
  {
    path: '',
    component: StripePayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripePayPageRoutingModule {}
