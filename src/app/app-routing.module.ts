import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'db-cifras',
    pathMatch: 'full'
  },
  {
    path: 'cifras',
    loadChildren: () => import('./cifras/cifras.module').then( m => m.CifrasPageModule)
  },
  {
    path: 'lista-estilo',
    loadChildren: () => import('./lista-estilo/lista-estilo.module').then( m => m.ListaEstiloPageModule)
  },
  {
    path: 'lista-cifras',
    loadChildren: () => import('./lista-cifras/lista-cifras.module').then( m => m.ListaCifrasPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forget',
    loadChildren: () => import('./forget/forget.module').then( m => m.ForgetPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'slides-intro',
    loadChildren: () => import('./slides-intro/slides-intro.module').then( m => m.SlidesIntroPageModule)
  },
  {
    path: 'post-cifra',
    loadChildren: () => import('./post-cifra/post-cifra.module').then( m => m.PostCifraPageModule)
  },
  {
    path: 'lista-pdf',
    loadChildren: () => import('./lista-pdf/lista-pdf.module').then( m => m.ListaPdfPageModule)
  },
  {
    path: 'abre-pdf',
    loadChildren: () => import('./abre-pdf/abre-pdf.module').then( m => m.AbrePdfPageModule)
  },
  {
    path: 'cria-cifra',
    loadChildren: () => import('./cria-cifra/cria-cifra.module').then( m => m.CriaCifraPageModule)
  },
  {
    path: 'edita-cifra',
    loadChildren: () => import('./edita-cifra/edita-cifra.module').then( m => m.EditaCifraPageModule)
  },
  {
    path: 'db-cifras',
    loadChildren: () => import('./db-cifras/db-cifras.module').then( m => m.DbCifrasPageModule)
  },
  {
    path: 'stripe-pay',
    loadChildren: () => import('./stripe-pay/stripe-pay.module').then( m => m.StripePayPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
