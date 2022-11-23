import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { AlertController, IonContent, IonSelect, LoadingController, NavController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { getDatabase, onValue, ref } from 'firebase/database';


@Component({
  selector: 'app-cifras',
  templateUrl: './cifras.page.html',
  styleUrls: ['./cifras.page.scss'],
})
export class CifrasPage {

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('select1') select1: IonSelect;

  htmlTerms : string;
  public Lista = new Array;
  public Lista2 = [];
  public cifraAtual : any;
  
  title: string;
  //url:string;
  //public url2: any;
  logado2;
  selectedVal:Number = 1;
  velplay : number = 0.2;
  contvel : number = 1;
  count = null;
  repertorio: number;
  ativado: number;
  velocidade:any 
  artista: any;
  musica: any;
  categoria;
  cifra;

  artistFront:any;
  musicaFront:any;
  textArtista: any;
  textMusica: any;
  zoom = 15;
  data2 : any[];
  dataLocal;
  armazenaLocal : any[];
  armazenaClick;
  armazenaClick2;
  localLista : any[];
 
  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hideurlbar:'yes',//Or 'no'

};


  constructor(
    private alertCtrl : AlertController,
    private activeRoutes: ActivatedRoute, 
    private router:Router,
    public navCtrl: NavController, 
    private loadingCtrl: LoadingController,
    public iaB : InAppBrowser,
    private afDB: AngularFireDatabase,

  ) {
    this.logado2 = localStorage.getItem('Logado');
    console.log(this.logado2);

    this.dataLocal = localStorage.getItem('categoriacifra'+this.logado2);
    this.data2 = JSON.parse(this.dataLocal);
    console.log(this.data2);

    
    this.artista = this.activeRoutes.snapshot.paramMap.get('artista');
    this.musica = this.activeRoutes.snapshot.paramMap.get('musica');
    this.categoria = this.activeRoutes.snapshot.paramMap.get('categoria');
    this.cifra = this.activeRoutes.snapshot.paramMap.get('cifra');
    console.log(this.artista+'/'+this.musica);
    this.textArtista = this.artista;
    this.textMusica = this.musica;
    ///this.presentLoadingWithOptions();

    this.artistFront = this.artista;
    this.musicaFront = this.musica;

  }



  ngOnInit() {

 
   
    }

    loadData(){
 
     
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
    }


    scroolfunc(){
      this.content.scrollToPoint(0,2);
    }

    scrollContent(scroll) {
     
  
      this.ativado = 1;
    
   
  
      if (scroll === 'inicia') {    
  
        let i = 0.5;
        this.count = setInterval(() => {  
          let e = this.velplay;
          this.content.scrollToPoint(0,i+=e);
          
          console.log(i)  }, 50);
  
  
      }
      
      
    }
  
    velocidadeplay(){
  
      this.contvel +=1;
      if(this.contvel == 6){
        this.contvel = 1;
      }
      this.velplay += 0.5;
      if(this.velplay == 2.7){
        this.velplay = 0.2
      }
      console.log(this.contvel +"/"+ this.velplay)
    }
  
  
  
    scrollContent2() {
      this.ativado = 0;
      clearInterval(this.count)
      console.log(this.content.scrollY);
    }
  
  





    zomPage(){

      var span = document.getElementById("container");
      console.log(span);
   
  
      this.zoom += 0.5;
      if(this.zoom > 50){
        this.zoom = 15;
      }
      
      span.style.fontSize = this.zoom+"px";
  
    }
  
    zomPage2(){
  
      var span = document.getElementById("container");
      console.log(span);
  
      this.zoom -= 0.5;
      if(this.zoom < 15){
        this.zoom = 15;
      }
      span.style.fontSize = this.zoom+"px";
   
    }



    loadLists(event): void { 

      //console.log(document.getElementsByTagName('ion-textarea')[0].innerText);
         
      console.log(event.detail.value.idCategoria);
      this.armazenaClick = event.detail.value.idCategoria;  
      this.armazenaClick2 = event.detail.value.categoria;  

      if(this.armazenaClick){

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {

      this.alertCtrl.create({
        header: "Repertório "+this.armazenaClick2,
         subHeader: "Deseja salvar esta cifra?",
         inputs:[
          {type:'text', name:'musica', placeholder:"Música", id:"musica", value: this.musicaFront },
          {type:'text', name:'artista', placeholder:"Artista", id:"artista", value: this.artistFront},
          {type:'textarea', name:'cifra', placeholder:"Copie e cole uma cifra de outro lugar aqui dentro...", id:"cifra", value: document.getElementsByTagName('ion-textarea')[0].innerText},
           //{type:'file', name:'cadastro', placeholder:"Categoria", id:"avatar"}
         ],
         
         
         buttons:[
           {text: "Salvar", handler: (res)=>{
             console.log(res.cadastro);

             //let file = (<HTMLInputElement>document.getElementById('avatar')).files[0];

                         
             //this.presentLoadingWithOptions();

             const artista = res.artista;
             const musica = res.musica;
             const cifra = res.cifra;
             //this.musicaPdf = musica;
             
             
             //console.log(file);

             

                      
   
                 this.afDB.list('cifras/' + user.uid+ '/' + this.armazenaClick).push({

                  categoria: this.armazenaClick2,
                  artista: artista,
                  musica: musica,
                  cifra: cifra,
                  usuario: user.email,
                 });
                

              this.listar()

              //this.loadingCtrl.dismiss();

               
              this.router.navigateByUrl('cria-cifra');

             
 
           }
          },
          {
            text: "Voltar"
          }
         ]
       }).then(res=> res.present());
      }
        )
    }

    }

    openSelect(){
      this.select1.open()
      }


      listar(){
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          
          
          if (user) {
                   
            const db = getDatabase();
            const dbRef = ref(db, '/cifras/'+user.uid+'/'+this.armazenaClick+'/');
            onValue(dbRef, (snapshot2) => {
            let trip = [];
            snapshot2.forEach((childSnapshot) => {
            const data2 = childSnapshot.val();
            trip.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
            this.localLista = [];
            this.localLista = trip;

            let json = JSON.stringify(this.localLista);
            localStorage.setItem('ciflex'+this.armazenaClick+this.logado2, json);
            
            this.dataLocal = localStorage.getItem('ciflex'+this.armazenaClick+this.logado2);
            this.data2 = JSON.parse(this.dataLocal);
            console.log(this.data2);

           
         
            // ...
            });
           
            
            }, {
            onlyOnce: true
            });
           } else {
            console.log("usuário não está logado");
             // User is signed out
             // ...
           }
        })
        
      }

      
      goBack() {
        this.navCtrl.back();
        }

}
