import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';
import { DocumentViewer, } from '@awesome-cordova-plugins/document-viewer/ngx';
///import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import  { PdfViewerModule  }  from  'ng2-pdf-viewer';
import  { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer} from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Device } from '@awesome-cordova-plugins/device/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
  BrowserModule, IonicModule.forRoot(), AppRoutingModule, 
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireAuthModule, FormsModule, HttpClientModule, AngularFireDatabaseModule, AngularFirestoreModule.enablePersistence(),
  AngularFireStorageModule, NgxExtendedPdfViewerModule,
  PdfViewerModule, Ng2SearchPipeModule

],
  providers: [ { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DocumentViewer, FileOpener,Device, FileTransfer, InAppBrowser, File, HTTP, AndroidPermissions
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
