import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, NavController, Platform } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from 'firebase/database';
import { DocumentViewer, DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
//import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { Sanitizer } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InAppBrowser, InAppBrowserOptions} from '@awesome-cordova-plugins/in-app-browser/ngx';
import  { FileOpener } from '@ionic-native/file-opener/ngx';
import { IonSlides} from '@ionic/angular';





@Component({
  selector: 'app-lista-pdf',
  templateUrl: './lista-pdf.page.html',
  styleUrls: ['./lista-pdf.page.scss'],
})
export class ListaPdfPage implements OnInit {

  @ViewChild('mySlider')  slides: IonSlides;
  @ViewChild(IonContent) content: IonContent;

  datamusica;
  musicacifra;
  artistacifra;
  velplay : number = 0.2;
  contvel : number = 1;
  dataLocal;
  logado2;
  count = null;
  repertorio: number;
  ativado: number;
  velocidade:any 
  estilo: any;
  estilo2: any;
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
zoom = 1;
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

    this.logado2 = localStorage.getItem('Logado');
   

    this.contador2 = 0;
    this.estilo = this.activeRoutes.snapshot.paramMap.get('categoria');
    this.estilo2 = this.activeRoutes.snapshot.paramMap.get('categoria2');
    console.log(this.estilo2, this.estilo);
    this.datalocal = localStorage.getItem(this.estilo+this.logado2);
    console.log(this.dataLocal);
    this.data = JSON.parse(this.datalocal);
    if (this.data != null){
      console.log(this.logado2);
      this.listapdfstorage();
    // localStorage.removeItem('Logado');
    this.dataPdf = this.data.slice(this.contador2,this.contador2+1);
    //this.dataPdf = this.data;
    console.log(this.data);
    this.contador = this.data.length;
    this.repertorio = this.contador2;
    console.log(this.dataPdf);
    this.repertorio +=1;

    }else{
      this.presentALert('No data');
    }
    
   }

   listapdfstorage(){

    
    
    const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        
        
        if (user) {
                 
       
          const db = getDatabase();
          const dbRef = ref(db, '/cifraspdf/'+this.logado2+'/'+this.estilo+'/');
          onValue(dbRef, (snapshot2) => {
          let trip = [];
          snapshot2.forEach((childSnapshot) => {
          const data2 = childSnapshot.val();
          console.log(data2);
          trip.push(data2);
          this.data = trip;
          let json = JSON.stringify(this.data);
          localStorage.setItem(this.estilo+this.logado2, json);
          
          console.log(this.dataPdf);
          this.dataLocal = localStorage.getItem(this.estilo+this.logado2);
          this.dataPdf = JSON.parse(this.dataLocal);
          });
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


   RemoveItem(){
   console.log(this.dataPdf[0].id, this.logado2);
   console.log(this.data);

   for (let index = 0; index < this.data.length; index++) {
    const element = this.data[index];

    if (element.musica == this.dataPdf[0].musica){
      this.data.splice(index, 1);
      let json = JSON.stringify(this.data);
      localStorage.setItem(this.estilo+this.logado2, json);
      break
     }
    
  }

   this.afDB.database.ref('/cifraspdf/'+this.logado2+'/'+ this.estilo +'/' + this.dataPdf[0].id).remove().then((d)=>{
       console.log(d)
       this.presentALert('Success');
    })
  
   }

   async presentALert(f) {
    const loading = await this.alertCtrl.create({
      message: f,
    });
    await loading.present();
 
  }

   openPdf(linkcifra){

    let url = encodeURIComponent(linkcifra)

    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    //this.iaB.create('http://docs.google.com/viewer?url='+url, '_blank', this.options);
    this.document.viewDocument("/assets/images/hino1.pdf", 'application/pdf', options);
    window.open(`/assets/images/hino1.pdf`);


    //this.document.viewDocument(this.file.applicationDirectory + 'www/assets/images/hino1.pdf', 'application/pdf', options)
    ///const imgeLocation = `${cordova.file.applicationDirectory}www/assets/imgs/${pdff}`;


    //window.open(url);
    //this.document.viewDocument('assets/images/myFile.pdf', 'application/pdf', {})
    console.log(linkcifra);

  }


  

  
  showPdf(){
    //this.urlPDf =  link;
    this.viewPDF = true;
  }


  ngOnInit() {

    
    
    const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        
        
        if (user) {
                 
       
          const db = getDatabase();
          const dbRef = ref(db, '/cifraspdf/'+user.uid+'/'+this.estilo+'/');
          onValue(dbRef, (snapshot2) => {
          let trip = [];
          snapshot2.forEach((childSnapshot) => {
          const data2 = childSnapshot.val();
          trip.push(data2);
          //this.data = trip;
          //this.contador = this.data.length;
          //console.log(listDB);
          //const childData = childSnapshot.val();
          //console.log(childKey);
          //...
          });
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
    // console.log(this.contador2, this.dataPdf)
    // console.log(this.dataPdf[this.contador2].artista);
    this.repertorio +=1;
    console.log(this.dataPdf);
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
    // console.log(this.contador2, this.dataPdf)
    // console.log(this.dataPdf[this.contador2].artista);
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


  scrollContent(scroll) {


    this.ativado = 1;
    if (scroll === 'inicia') {
      
      let i = 0.5;
      this.count = setInterval(() => {
      let e = this.velplay;
      document.getElementsByClassName('ng2-pdf-viewer-container')[0].scrollTo(0, i+=e);
      console.log(i);
  
      }, 50);
    

    } 
  }

  scrollContent2() {
    this.ativado = 0;
    clearInterval(this.count)
  }


  zomPage(){

    this.zoom += 0.5;
    if(this.zoom > 4){
      this.zoom = 1;
    }
  }

  zomPage2(){

    this.zoom -= 0.5;
    if(this.zoom > 4){
      this.zoom = 1;
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


}
