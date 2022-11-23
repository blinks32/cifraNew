import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostCifraPageRoutingModule } from './post-cifra-routing.module';

import { PostCifraPage } from './post-cifra.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostCifraPageRoutingModule
  ],
  declarations: [PostCifraPage]
})
export class PostCifraPageModule {}
