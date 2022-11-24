import { HttpService } from './../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, Input, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, get, child, DatabaseReference } from "firebase/database";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { getStorage, getDownloadURL } from "firebase/storage";
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable } from 'rxjs';

const incr = 1;


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  loadProgress = 77;
    user: any = {};
  userLogado : any = {};
  userUpload: any = {};
  email;
  usuario;
  darkMode: boolean = false;

  public progress = 0;

  selectedVal:Number = 1;
  data: any[];
  data2 : any[];
  data3 : any[];
  localLista : any[];
  armazenaLocal : any[];
  imageUrl?:String;
  dataLocal;
  dataPdf;
  codebase64: string = "";
  baseteste;
  //data : [];
  list;
  uid;
 
  armazenaClick;
  armazenaIdCat;
  private downloadedFile;
  musicaPdf;
  logado;
  logado2;
  estilo: any;
  fileAdded: boolean=true;
  allLinks: any [];
  currentLink: number = -1;
  nameArray: any;
  myToast: HTMLIonToastElement;
  currentPlan: any = 'free';
  myAlert: HTMLIonAlertElement;

  constructor(
    private auth: AngularFireAuth,
    private afStore: AngularFireStorage,
    private activeRoutes: ActivatedRoute,
    private afDB: AngularFireDatabase,
    private route: Router,
    public checker: HttpService,
    private alertCtrl : AlertController,
    private router: Router,
    private transfer: FileTransfer, 
    private toastCntrl: ToastController,
    private file: File,
    private nativeHTTP: HTTP,
    private loadingCtrl: LoadingController,

  ) { 

    this.estilo = this.activeRoutes.snapshot.paramMap.get('categoria');
  }



  ngOnInit() {
    this.loadProgress = this.checker.numOFsongs;
    setInterval(() => this.manageProgress(), 150 )
  }

  manageProgress() {
    if(this.progress === 100) {
      this.progress = 0;
    } else {
      this.progress = this.progress + incr;
    }
  }







  async ionViewDidEnter(){
   

    
    //quem está logado
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user;
      

        const dbRef = ref(getDatabase());
        get(child(dbRef, 'users/'+user.uid)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            this.userLogado = snapshot.val();
            if (snapshot.val().stripeDetails){
              console.log(snapshot.val().stripeDetails);
              this.currentPlan = snapshot.val().stripeDetails.Selected_product_name;
              this.checker.currentPlan = this.currentPlan;
              console.log(this.checker.currentPlan);
            }
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
      this.route.navigateByUrl('/login');

      }
    });
    this.afDB.object('user/'+this.user.uid).snapshotChanges().subscribe((usersnap:any)=>{
      this.userUpload = { 'key': usersnap.key, ...usersnap.payload.val() };
      console.log(this.user.uid);
    })
    }


    

    toggleTheme(event){

      this.darkMode = !this.darkMode
      document.body.classList.toggle('dark');

    }



    update(){

      this.afDB.object('users/' + this.user.uid).update(this.userUpload);

    }

    logout(){
      this.auth.signOut().then(() => {
        this.route.navigateByUrl('/login');
      }).catch(e => {
        console.log(e);
      })
    }

    criarPost(){
    this.route.navigateByUrl('/post-cifra');

    }



    async writeFile() {
      if (this.downloadedFile == null) return;
      var filename = this.musicaPdf+'.pdf';
      await this.createFile(filename);
      await this.writeToFile(filename);
      this.DownloadFiles();
      this.myToast.dismiss();
      this.fileAdded = true;
    }

    async presentLoading(percent) {
      this.myToast =  await this.toastCntrl.create({
        //spinner: null,
       // duration: 5000,
        message: 'BACKUP DE ARQUIVOS ' + percent,
        //translucent: true,
        cssClass: 'custom-class custom-loading',
        //backdropDismiss: true
      });
      await this.myToast.present();
      
      
    }


    async presentAlert() {
      this.myAlert =  await this.alertCtrl.create({
        //spinner: null,
       // duration: 5000,
        message: 'SUCCESS'
        //translucent: true,
        //backdropDismiss: true
      });
      await this.myAlert.present();
      
    }
    
    Gotopayment(val){
      if (val == 0) {
        this.checker.Slected_product = ''
        this.checker.Slected_product_name = 'free'
      }
      if (val == 1) {
        this.checker.Slected_product = 'prod_MdLwyrZtC0HdiA'
        this.checker.Slected_product_name = 'standard'
      }
      if (val == 2) {
        this.checker.Slected_product = 'prod_MdLwyrZtC0HdiA'
        this.checker.Slected_product_name = 'premuim'
      }
      this.route.navigateByUrl('/stripe-pay');
    }

  
       

    check(){
      let num = false;
      if (this.checker.currentPlan == 'free')
      num = false
      if (this.checker.currentPlan == 'standard')
      num = true
      if (this.checker.currentPlan == 'premuim')
      num = true
      if (!this.checker.phoneChanged && num){
        this.presentLoading('Downloading...')
      const db = getDatabase();
      const dbRef = ref(db, '/cifraspdf/' + this.user.uid);
      onValue(dbRef, (snapshot2) => {
        this.nameArray = [];
        this.allLinks = [];
        snapshot2.forEach(element => {
          element.forEach(el=>{
           console.log(this.user.email);
            if (this.user.email == el.val().usuario){
              console.log(el.val().musica);
              this.nameArray.push(el.val().musica)
              this.allLinks.push(el.val().linkcifra);
              this.fileAdded = false;
              this.DownloadFiles();
            }
          })
        })
      })
    }
    }

    async DownloadFiles(){
      
     this.currentLink++;
      if (this.currentLink < this.allLinks.length){
      this.musicaPdf = this.nameArray[this.currentLink];
      this.checker.checkIfUploaidng = false;
      this.nativeHTTP.sendRequest(this.allLinks[this.currentLink], { method: "get", responseType: "arraybuffer" }).then(
        httpResponse => {
         // alert("File dowloaded successfully");
          console.log("File dowloaded successfully")
          this.downloadedFile = new Blob([httpResponse.data], { type: 'application/pdf' });
          this.writeFile();
        }
      ).catch(err => {
        this.loadingCtrl.dismiss();
        console.error(err);
      })
    }else{
      console.log('All Files Have Been backed Up.')
      this.currentLink = -1
      this.myToast.dismiss();
      this.presentAlert();
      this.checker.checkIfUploaidng = true;
    }
    }
  
  
    async createFile(filename) {
      try{
      await this.file.createDir(this.file.externalApplicationStorageDirectory,'Ciflex'+this.user.uid , true)
      await this.file.createFile(this.file.externalApplicationStorageDirectory+"/Ciflex"+this.user.uid, filename, false)
    }catch(e){
      console.log('File Creation Error ' + e)
    }
    }
  
    async writeToFile(filename) {
       try{
      const createdFile = await this.file.writeFile(this.file.externalApplicationStorageDirectory+"/Ciflex"+this.user.uid, filename, this.downloadedFile, { replace: true, append: false })
        console.log('File written successfully.');
        console.log(createdFile)
        this.loadingCtrl.dismiss();
    }catch(e){
      this.loadingCtrl.dismiss();
      console.log('File written Unsuccessfully.');
      console.log(e);
    }
    }
  
    

}
