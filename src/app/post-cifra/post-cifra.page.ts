import { HttpService } from './../services/http.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import {AlertController, IonSlides, LoadingController, Platform} from '@ionic/angular'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref, onDisconnect, set, push } from 'firebase/database';
//import { File } from '@ionic-native/file/ngx';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';





@Component({
  selector: 'app-post-cifra',
  templateUrl: './post-cifra.page.html',
  styleUrls: ['./post-cifra.page.scss'],
})
export class PostCifraPage implements OnInit {

  @ViewChild('mySlider')  slides: IonSlides;


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
  userLogado:any = {};
  userUpload: any = {};
  armazenaClick;
  armazenaIdCat;
  private downloadedFile;
  musicaPdf;
  logado;
  logado2;

  
  
  constructor(

    private platform : Platform,
    private alertCtrl : AlertController,
    private auth: AngularFireAuth,
    private afStore: AngularFireStorage,
    private afDB: AngularFireDatabase,
    private router: Router,
    private transfer: FileTransfer, 
    private file: File,
    private nativeHTTP: HTTP,
    public checker: HttpService,
    private loadingCtrl: LoadingController,
    private route: Router,

    ){
      /*this.platform.ready().then(()=>{
        this.data = [{
          id: 1, name:"Repertório 01"},{
          id: 2, name:"Repertório 02"},{
          id: 3, name:"Repertório 03"}];
      })*/
      this.logado2 = localStorage.getItem('Logado');
      console.log(this.logado2);
      
      this.dataLocal = localStorage.getItem('categorias' + this.logado2);
      this.data2 = JSON.parse(this.dataLocal);
      console.log(this.data2);
     }

     
     
     async ngOnInit() {

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {

        this.uid = user.uid;

               if (user) {
                 
                 
                let listDB = this.afDB.database.ref('/categorias').child(user.uid);
                var itemsQuery = listDB.orderByChild('categoria');
                itemsQuery.on('value', (snapshot) =>{
                  //this.data = snapshot.val();
                  //console.log(this.data);
                })

                const db = getDatabase();
                const dbRef = ref(db, '/categorias/'+user.uid+'/');
                onDisconnect(dbRef);
                onValue(dbRef, (snapshot2) => {
                let trip = [];
                console.log('This is category' + this.checker.currentPlan)
                snapshot2.forEach((childSnapshot) => {
                const data2 = childSnapshot.val();
                trip.push({
                  idCategoria: childSnapshot.key,
                  ...childSnapshot.val()
                });
                this.data = trip;
                let json = JSON.stringify(this.data);
                localStorage.setItem('categorias'+this.uid, json);
                  
                //console.log(listDB);
                //const childData = childSnapshot.val();
                //console.log(childKey);
                // ...
                });
                //console.log(this.data);
                console.log(this.data2);
                this.dataLocal = localStorage.getItem('categorias'+this.uid);
                this.data2 = JSON.parse(this.dataLocal);
                }, {
                //onlyOnce: true
                });
               } else {
                this.route.navigateByUrl('/login');
                 // User is signed out
                 // ...
               }
            
               this.afDB.object('user/'+this.uid).snapshotChanges().subscribe((usersnap:any)=>{
                this.userUpload = { 'key': usersnap.key, ...usersnap.payload.val() };
                console.log(this.uid);
              })
              });

       }

       async showAlert(){
        let num = 0;
        if (this.checker.currentPlan == 'free')
        num = 5
        if (this.checker.currentPlan == 'standard')
        num = 50
        if (this.checker.currentPlan == 'premuim')
        num = 500

        if (this.checker.checkIfUploaidng && this.checker.numOFsongs <= num){
        await this.alertCtrl.create({
          header: "Repertório",
          subHeader: "Didigite a baixo.",
          inputs:[
            {type:'text', name:'cadastro', placeholder:"Categoria"}
          ],
          buttons:[
            {text: "Cadastrar", handler: (res)=>{
              console.log(res.cadastro);
 
              const auth = getAuth();
              onAuthStateChanged(auth, (user) => {
 
                if (user) {
                  // User is signed in, logado
                 
                  this.uid = user.uid;
 
                  
                  const db = getDatabase();
                  push(ref(db, 'categorias/' + user.uid), {
                   categoria: res.cadastro,
                   email: user.email,
                   id: user.uid,
                   createdAt: Date.now()
                 }).then(()=>{
                   
                   const db = getDatabase();
                   const dbRef = ref(db, '/categorias/'+user.uid+'/');
                   onDisconnect(dbRef);
                   onValue(dbRef, (snapshot2) => {
                   let trip = [];
                   snapshot2.forEach((childSnapshot) => {
                   const data2 = childSnapshot.key
                   trip.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                  });
                   this.data = trip;
                   let json = JSON.stringify(this.data);
                   localStorage.setItem('categorias'+this.uid, json);
 
                   
 
                 });
                 //console.log(this.data);
                 console.log(this.data2);
                 }, {
                   //onlyOnce: true
                   });
 
                   
                   this.ngOnInit();
           
                 });
               
 
                  // ...
                } else {
                  // User is signed out
                  // ...
                }
              });
 
              
            }
           },
           {
             text: "Cancel"
           }
          ]
        }).then(res=> res.present());
      }else{
        alert("Upload In progress")
;      }
       
      }
 

       loadLists(event): void { 
         
        console.log(event.detail.value.idCategoria);
        console.log(event.detail.value.categoria)
        this.armazenaClick = event.detail.value.categoria;   
        this.armazenaIdCat = event.detail.value.idCategoria;

      }

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }


  
     upload(){
      let file = (<HTMLInputElement>document.getElementById('avatar')).files[0];
      let ref = this.afStore.ref('upload/' + this.uid + '/' + file.name);
      console.log(this.uid);
      
      ref.put(file).then(res =>{

        ref.getDownloadURL().subscribe(url => {

          this.userUpload.imgURL = url;
        });

      }).catch(error =>{
        console.log(error);
      });

    }




 async alertaUpload(){
  if(this.armazenaClick){

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {

       this.alertCtrl.create({
        header: "Repertório "+this.armazenaClick,
         subHeader: "Selecione um arquivo",
         inputs:[
          {type:'text', name:'musica', placeholder:"Música", id:"musica", },
          {type:'text', name:'artista', placeholder:"Artista", id:"artista"},
           {type:'file', name:'cadastro', placeholder:"Categoria", id:"avatar"}
         ],
         
         
         buttons:[
           {text: "Cadastrar", handler: (res)=>{
             console.log(res.cadastro);

             let file = (<HTMLInputElement>document.getElementById('avatar')).files[0];

                         
             
             const artista = res.artista;
             const musica = res.musica;

             this.musicaPdf = musica;
             
             
             console.log(file);

             

             this.presentLoadingWithOptions();
         
             let ref = this.afStore.ref('upload/' + this.uid + '/' + file.name);
             
             ref.put(file).then(res =>{
       
               ref.getDownloadURL().subscribe(url => {

                console.log(url);


                      
                 this.userUpload.imgURL = url;
                 console.log(this.userUpload.imgURL);
    
               
                 this.nativeHTTP.sendRequest(url, { method: "get", responseType: "arraybuffer" }).then(
                   httpResponse => {
                     console.log("File dowloaded successfully")
                     this.downloadedFile = new Blob([httpResponse.data], { type: 'application/pdf' });
                     this.writeFile();
                   }
                 ).catch(err => {
                   console.error(err);
                 })
                
                let caminho = "file:///storage/emulated/0/Android/data/com.ciflex.app/Ciflex"+this.uid+"/"+musica+".pdf"
                let datapdf2 = Capacitor.convertFileSrc(caminho);
                console.log(datapdf2);

                 this.afDB.list('cifraspdf/' + user.uid+ '/' + this.armazenaIdCat).push({

                  categoria: this.armazenaClick,
                  artista: artista,
                  musica: musica,
                  cifra:"nome da cifra",
                  linkcifra: this.userUpload.imgURL,
                  usuario: user.email,
                  linkBase64: datapdf2
                 });
                
                 this.file.createDir(this.file.externalApplicationStorageDirectory,'Ciflex'+this.uid, true).then((val)=>{
                  console.log("Criado "+val);
                }).catch(e => {
                  console.log("error", e)
                });

                 //this.listar()
                 this.listapdfstorage();
                 this.loadingCtrl.dismiss();

               
                });

            
               ///localStorage.setItem(this.armazenaClick, JSON.stringify([this.localLista]));
             
       
             }).catch(error =>{
               console.log(error);
               this.loadingCtrl.dismiss();

             });
             
 
           }
          },
          {
            text: "Cancel"
          }
         ]
       }).then(res=> res.present());

     
     
     
      }
       
     )

    }
  }

    async writeFile() {
    if (this.downloadedFile == null) return;
    var filename = this.musicaPdf+'.pdf';
    await this.createFile(filename);
    await this.writeToFile(filename);
  }

  async createFile(filename) {
    
    this.file.createDir(this.file.externalApplicationStorageDirectory,'Ciflex'+this.uid, true).then((val)=>{
      console.log("Criado "+val);
    }).catch(e => {
      console.log("error", e)
    });
    return this.file.createFile(this.file.externalApplicationStorageDirectory+"/Ciflex"+this.uid, filename, false).catch(err => {
      console.error(err);
    })
  }

  writeToFile(filename) {
    
    return this.file.writeFile(this.file.externalApplicationStorageDirectory+"/Ciflex"+this.uid, filename, this.downloadedFile, { replace: true, append: false }).then(createdFile => {
      console.log('File written successfully.');
      console.log(createdFile)
      this.loadingCtrl.dismiss();
    }).catch(err => {
      this.loadingCtrl.dismiss();
      console.error(err);
    });
  }
  
    
  
     itemClick(item){
     
      console.log(item.idCategoria);
      let categoria = item.idCategoria;
      let categoria2 = item.categoria;
      this.armazenaIdCat = item.idCategoria;
      this.router.navigate(['lista-pdf', {categoria, categoria2}]);
     
    }
   

    listapdfstorage(){

    
    
      const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          
          
          if (user) {
                   
         
            const db = getDatabase();
            const dbRef = ref(db, '/cifraspdf/'+this.logado2+'/'+this.armazenaIdCat+'/');
            onValue(dbRef, (snapshot2) => {
            let trip = [];
            snapshot2.forEach((childSnapshot) => {
            const data2 = childSnapshot.val();
         
            trip.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
            this.data = trip;
            let json = JSON.stringify(this.data);
            localStorage.setItem(this.armazenaIdCat+this.logado2, json);
            
            console.log(this.dataPdf);
            this.dataLocal = localStorage.getItem(this.armazenaIdCat+this.logado2);
            this.dataPdf = JSON.parse(this.dataLocal);
            });
           /// console.log(this.data);
           this.loadingCtrl.dismiss();

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

    deleteSpace(item){
      
      console.log(item);

      this.popupdelete(item);
   }


   async popupdelete(item){

    
    this.alertCtrl.create({
     header: "Repertório "+ item.categoria,
      subHeader: "Deseja deletar esta categoria?",
    
      
      
      buttons:[
        {text: "Deletar", handler: (res)=>{

          

         const auth = getAuth();
         onAuthStateChanged(auth, (user) => {
   
     if (user) {
      
          this.data2.splice(item, 1);
          let json = JSON.stringify(this.data2);
          localStorage.setItem('categorias'+this.logado2, json);

         this.afDB.database.ref('categorias/' + user.uid +'/'+item.idCategoria+'/').remove().then(function() {
       })
       .catch(function(error) {
         console.log("Remove failed: " + error.message)
       });
       // User is signed in, see docs for a list of available properties
       // https://firebase.google.com/docs/reference/js/firebase.User
       const uid = user.uid;
       // ...
     } else {
       // User is signed out
       // ...
           }
       });
         

        }
       },
       {
         text: "Voltar"
       }
      ]
    }).then(res=> res.present());


}

async editaCategoria(item){

  console.log(item)
  await this.alertCtrl.create({
    header: "Alterar nome da categoria",
    subHeader: "Didigite a baixo o novo nome.",
    inputs:[
      {type:'text', name:'cadastro', value: item.categoria , placeholder: item.categoria}
    ],
    buttons:[
      {text: "Salvar", handler: (res)=>{
        console.log(res.cadastro);

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {

          if (user) {
            // User is signed in, logado
           
            this.uid = user.uid;

            this.afDB.object('categorias/' + user.uid+ '/' + item.idCategoria).update({

              categoria: res.cadastro,
             
             }).then(()=>{

              const db = getDatabase();
              const dbRef = ref(db, '/categorias/'+user.uid+'/');
              onDisconnect(dbRef);
              onValue(dbRef, (snapshot2) => {
              let trip = [];
              snapshot2.forEach((childSnapshot) => {
              const data2 = childSnapshot.key
              trip.push({
                idCategoria: childSnapshot.key,
                ...childSnapshot.val()
              });
              this.data = trip;
              let json = JSON.stringify(this.data);
              localStorage.setItem('categorias'+this.logado2, json);

              

            });
            //console.log(this.data);
            console.log(this.data2);
            }, {
              //onlyOnce: true
              });

              //this.router.navigateByUrl('/post-cifra');
              this.ngOnInit();
      
            });
            
          
            // ...
          } else {
            // User is signed out
            // ...
          }
        });

        
      }
     },
     {
       text: "Cancel"
     }
    ]
  }).then(res=> res.present());
  
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
    //this.loadData();
  }

    }
    
