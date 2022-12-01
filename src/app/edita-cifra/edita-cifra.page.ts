import { element } from 'protractor';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, NavController, Platform } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, orderByChild, ref } from 'firebase/database';
import { DocumentViewer, DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
//import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Sanitizer } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InAppBrowser, InAppBrowserOptions} from '@awesome-cordova-plugins/in-app-browser/ngx';
import  { FileOpener } from '@ionic-native/file-opener/ngx';
import { IonSlides} from '@ionic/angular';


@Component({
  selector: 'app-edita-cifra',
  templateUrl: './edita-cifra.page.html',
  styleUrls: ['./edita-cifra.page.scss'],
})
export class EditaCifraPage implements OnInit {

  @ViewChild('mySlider')  slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;

  dataLocal;
  data2 : any[];
  logado2;
  velplay : number = 0.2;
  contvel : number = 1;
  count = null;
  repertorio: number;
  ativado: number;
  editar: boolean = false;
  textoArea;
  velocidade:any 
  estilo: any;
  estilo2: any;
  selectCat;
  filterTerm: string;
  data : any[];
  dataPdf : any[];
  datalocal;
  urlPDf;
  viewPDF:Boolean = false;
  urlSafe: SafeResourceUrl;
  objeto: any[];
  totalPages: number;
  page: number = 1;
  isLoaded: boolean = false;
  slideOpts = {
    initialSlide: 30,
    speed: 500
};
zoom = 15;
  contador;
  contador2=0;
  

  mySlideOptions = {
    pager:true
  };



  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hideurlbar:'yes',//Or 'no'

};
  userID: string;

  constructor(

    public navCtrl: NavController, 
    public http: HttpClient, 
    private activeRoutes: ActivatedRoute,
    private router:Router,
    private loadingCtrl: LoadingController,
    private platform : Platform,
    private alertCtrl : AlertController,
    private auth: AngularFireAuth,
    private afStore: AngularFireStorage,
    private afDB: AngularFireDatabase,
    private document: DocumentViewer,
    private file: File,
    private fileOpener: FileOpener,
    private sanitiser: Sanitizer,
    public sanitizer: DomSanitizer,
    public iaB : InAppBrowser,
    

  ) {
    this.editar = false;
    this.logado2 = localStorage.getItem('Logado');
    console.log(this.logado2);
    //this.listapdfstorage();

    this.contador2 = 0;
    this.estilo = this.activeRoutes.snapshot.paramMap.get('categoria');
    this.estilo2 = this.activeRoutes.snapshot.paramMap.get('categoria2');
    console.log(this.estilo2);
    this.datalocal = localStorage.getItem('ciflex'+this.estilo+this.logado2);
    this.data = JSON.parse(this.datalocal);
    this.dataPdf = this.data.slice(this.contador2,this.contador2+1);
    //this.dataPdf = this.data;
    this.selectCat = this.dataPdf[0].categoria;
    this.contador = this.data.length;
    this.repertorio = this.contador2;
    console.log(this.dataPdf[0].categoria);
    this.repertorio +=1;
   
   }



  ngOnInit() {
  
    const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        
        
        if (user) {
              
          this.userID = user.uid
       
          const db = getDatabase();
          const dbRef = ref(db, '/cifras/'+user.uid+'/'+this.estilo+'/');
          onValue(dbRef, (snapshot2) => {
          let trip = [];
          snapshot2.forEach((childSnapshot) => {
          const data2 = childSnapshot.val();
          trip.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
          //console.log(data2);
          this.data = trip;
          let json = JSON.stringify(this.data);
          localStorage.setItem('ciflex'+this.estilo+this.logado2, json);

          });

          this.dataLocal = localStorage.getItem('ciflex'+this.estilo+this.logado2);
          this.data2 = JSON.parse(this.dataLocal);
         /// console.log(this.data);
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

  salvar(){
    this.editar = true;
    console.log(this.dataPdf[0].id)
    console.log(this.editar)
  }

  async presentALert(f) {
    const loading = await this.alertCtrl.create({
      message: f,
    });
    await loading.present();
 
  }


  RemoveItem(){
    console.log(this.dataPdf[0].id, this.logado2, this.estilo);
    console.log(this.data);

    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
      if (element.musica == this.dataPdf[0].musica){
        this.data.splice(index, 1);
        let json = JSON.stringify(this.data);
        localStorage.setItem('ciflex'+this.estilo+this.logado2, json);
        break
       }
    }
    this.afDB.database.ref('/cifras/'+this.userID+'/'+this.estilo+'/'+ this.dataPdf[0].id).remove().then((d)=>{
        console.log(d)
        this.presentALert('Success');
     })
   
    }

  editarTexto(){
 
 this.editar = false; 
console.log(this.repertorio);
console.log(this.textoArea)



this.afDB.object('cifras/' + this.logado2+ '/' + this.estilo + '/' + this.dataPdf[0].id).update({


  cifra: this.textoArea,
 
 }).then(()=>{
   
 this.lista();

});


}

  lista(){
    const db = getDatabase();
          const dbRef = ref(db, '/cifras/'+this.logado2+'/'+this.estilo+'/');
          onValue(dbRef, (snapshot2) => {
          let trip = [];
          snapshot2.forEach((childSnapshot) => {
          const data2 = childSnapshot.val();
          trip.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
          //console.log(data2);
          this.data = trip;
          let json = JSON.stringify(this.data);
          localStorage.setItem('ciflex'+this.estilo+this.logado2, json);

          });

          this.dataLocal = localStorage.getItem('ciflex'+this.estilo+this.logado2);
          this.data2 = JSON.parse(this.dataLocal);
         /// console.log(this.data);
          }, {
          onlyOnce: true
          });
  }
  

  itemClick(){

   this.router.navigate(['lista-cifras']);

    //alert(itemClick);
   
    console.log();
  }

  swipeNext(){
    if(this.contador2 < this.contador-1){
    this.slides.slideNext();
    this.slides.getActiveIndex().then(id => {
    this.contador2++;
    this.dataPdf = this.data.slice(this.contador2,this.contador2+1);
    this.repertorio = this.contador2;
    this.repertorio +=1;
    console.log(this.dataPdf);
    this.ativado = 0;
    clearInterval(this.count)
      }
 );
  }
}

  swipeBack(){
    if(this.contador2 > 0){
    this.slides.slidePrev();
    this.slides.getActiveIndex().then(id => {
    this.contador2--;
    this.dataPdf = this.data.slice(this.contador2,this.contador2+1);
    this.repertorio = this.contador2;
    this.repertorio += 1;
    console.log(this.dataPdf[0].id);
    this.ativado = 0;
    clearInterval(this.count)
  }
 );
  }
}

  nextPage() {
    this.page += 1;
  }

  previousPage() {
    this.page -= 1;
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
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

    var span = document.getElementById("span");
    console.log(span);
 

    this.zoom += 0.5;
    if(this.zoom > 50){
      this.zoom = 15;
    }
    
    span.style.fontSize = this.zoom+"px";

  }

  zomPage2(){

    var span = document.getElementById("span");
    console.log(span);

    this.zoom -= 0.5;
    if(this.zoom < 15){
      this.zoom = 15;
    }
    span.style.fontSize = this.zoom+"px";
 
  }


}
