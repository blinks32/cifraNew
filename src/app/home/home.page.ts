import { HttpService } from './../services/http.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { child, get, getDatabase, ref } from 'firebase/database';
import { Device } from '@awesome-cordova-plugins/device/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { getStorage, getDownloadURL } from "firebase/storage";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  user: any = {};
  userLogado : any = {};
  nome;
  public htmlTerms:[];
  public items:any;
  userUpload: any = {};
  public lista: [];
  
  
  public url: any;
  private downloadedFile;
  fileUploadTask: AngularFireUploadTask;
  // Upload progress
  percentageVal: Observable<number>;
  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;
  musicaPdf;
  categories = [
                { 
                  estilo:'Sertanejo'
                },
                { 
                  estilo:'Rock'
                },
                { 
                  estilo:'Gospel-Religioso'
                },
                { 
                  estilo:'Pop'
                },
                { 
                  estilo:'Reggae'
                },
                { 
                  estilo:'Pagode'
                },
                ];

 
 data = null;

  constructor(

    public navCtrl: NavController, 
    private router:Router,
    private http2:HttpClient,
    private loadingCtrl: LoadingController,
    private auth: AngularFireAuth,
    private afDB: AngularFireDatabase,
    private device: Device,
    public checker: HttpService,
    private alert: AlertController,
    private file: File,
    private afStore: AngularFireStorage,
    private nativeHTTP: HTTP,

    
 
    ) {
      ///this.loadData();  
      this.presentLoadingWithOptions();
      ///const topPremierLeagueScorers: ListaArtistas2[] = [];

  
  }

  CheckUserPhone(){
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'users/' + this.user.uid + '/device')).then(async (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        if (snapshot.val().device != this.device.uuid)
        {
           this.checker.phoneChanged = true;
        }

      }else{
        this.afDB.object('users/' + this.user.uid + '/device').update(this.device.uuid);
      }

    })
    
  }

  
  async ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user;
      
    console.log(user);
        const dbRef = ref(getDatabase());
        get(child(dbRef, 'users/'+user.uid)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            this.userLogado = snapshot.val();
            let nomevar = this.userLogado.name;
            this.nome = nomevar.slice(0,6);
            console.log(this.nome);
            this.CheckUserPhone();
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
        
        
       
        //acesso ao real database
      
        // ...
      } else {
        // User is signed out
        // ...
      //this.route.navigateByUrl('/login');

      }
    });

 
    
  }

  
  option = {
    slidesPerView:1.5,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    autoplay:true,
  }


  funcaologar(){
   
  }

  loadData(){
 
    interface ListaArtistas {
      artista: string;
      musica: string;
    }
    
    const url = 'https://www.vagalume.com.br/top100/musicas/cifras/';
    const AxiosInstance = axios.create(); // Create a new Axios Instance
    AxiosInstance.get(url).then(
        response => {
        const html = response.data;
        const $ = cheerio.load(html)
        const statsTable = $('ol > li');
        const topPremierLeagueScorers: ListaArtistas[] = [];

    
        statsTable.each((i, elem)=>{
         
          const artista: string = $(elem).find('.topInfo > div > .w1').text();
          const musica: string = $(elem).find('.topInfo > div > .styleBlack').text();

          topPremierLeagueScorers.push({
            artista,
            musica,
            });
        });
      
        this.items = topPremierLeagueScorers.slice(0,10);
        console.log(topPremierLeagueScorers);
           this.loadingCtrl.dismiss();
       

      })
      .catch( response =>  this.loadingCtrl.dismiss());
      
     
  }

  trataCategoria(estilo){
    this.router.navigate(['lista-estilo', {estilo}]);

  }

  visualizaCifra(artista, musica){
  
    this.router.navigate(['cifras', {artista, musica}]);

  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingCtrl.create({
      //spinner: null,
     // duration: 5000,
      message: 'Aguarde...',
      //translucent: true,
      cssClass: 'custom-class custom-loading',
      //backdropDismiss: true
    });
    await loading.present();
    this.loadData();
    this.funcaologar();
  }


  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      //spinner: null,
     // duration: 5000,
      message: 'BACKUP DE ARQUIVOS',
      //translucent: true,
      cssClass: 'custom-class custom-loading',
      //backdropDismiss: true
    });
    await loading.present();
    
  }

logout(){
  this.router.navigate(['profile']);
  /*this.auth.signOut().then(() => {
    this.router.navigateByUrl('/login');
  }).catch(e => {
    console.log(e);
  })*/
}

criarPost(){
  this.router.navigateByUrl('post-cifra');

  }


  

}

  
