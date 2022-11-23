import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import {AlertController, IonSlides, LoadingController, Platform} from '@ionic/angular'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref, onDisconnect, set, update, push } from 'firebase/database';
//import { File } from '@ionic-native/file/ngx';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-cria-cifra',
  templateUrl: './cria-cifra.page.html',
  styleUrls: ['./cria-cifra.page.scss'],
})
export class CriaCifraPage implements OnInit {

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
    private loadingCtrl: LoadingController,
    private route: Router,

    ){
      /*this.platform.ready().then(()=>{
        this.data = [{
          id: 1, name:"Repertório 01"},{
          id: 2, name:"Repertório 02"},{
          id: 3, name:"Repertório 03"}];
      })*/

      const auth2 = getAuth();
      onAuthStateChanged(auth2, (user) => {

        this.uid = user.uid;

               if (user) {
                 
                 
               } else {
                this.route.navigateByUrl('/login');
                 // User is signed out
                 // ...
               }
            
             
              });


      this.logado2 = localStorage.getItem('Logado');
      console.log(this.logado2);

      this.dataLocal = localStorage.getItem('categoriacifra'+this.logado2);
      this.data2 = JSON.parse(this.dataLocal);
      console.log(this.data2);

      
     }


     async ngOnInit() {

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {

        this.uid = user.uid;

               if (user) {
                 
                 
                let listDB = this.afDB.database.ref('/categoriacifra').child(user.uid);
                var itemsQuery = listDB.orderByChild('categoria');
                itemsQuery.on('value', (snapshot) =>{
                  //this.data = snapshot.val();
                  //console.log(this.data);
                })

                const db = getDatabase();
                const dbRef = ref(db, '/categoriacifra/'+user.uid+'/');
                onDisconnect(dbRef);
                onValue(dbRef, (snapshot2) => {
                let trip = [];
                snapshot2.forEach((childSnapshot) => {
                const data2 = childSnapshot.val();
                trip.push({
                  idCategoria: childSnapshot.key,
                  ...childSnapshot.val()
                });
                this.data = trip;
                let json = JSON.stringify(this.data);
                localStorage.setItem('categoriacifra'+this.logado2, json);
                  
                //console.log(listDB);
                //const childData = childSnapshot.val();
                //console.log(childKey);
                // ...
                });
                //console.log(this.data);
                console.log(this.data2);
                this.dataLocal = localStorage.getItem('categoriacifra'+this.logado2);
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
 
                  
                 this.afDB.list('categoriacifra/' + user.uid).push({

                   categoria: res.cadastro,
                   email: user.email,
                   id: user.uid,
                   createdAt: Date.now()
                 }).then(()=>{
     
                   const db = getDatabase();
                   const dbRef = ref(db, '/categoriacifra/'+user.uid+'/');
                   onDisconnect(dbRef);
                   onValue(dbRef, (snapshot2) => {
                   let trip = [];
                   snapshot2.forEach((childSnapshot) => {
                   console.log(childSnapshot.key)
                   trip.push({
                    idCategoria: childSnapshot.key,
                    ...childSnapshot.val()
                  });
                   this.data = trip;
                   let json = JSON.stringify(this.data);
                   localStorage.setItem('categoriacifra'+this.logado2, json);
              
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

                this.afDB.object('categoriacifra/' + user.uid+ '/' + item.idCategoria).update({

                  categoria: res.cadastro,
                 
                 }).then(()=>{
   
                  const db = getDatabase();
                  const dbRef = ref(db, '/categoriacifra/'+user.uid+'/');
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
                  localStorage.setItem('categoriacifra'+this.logado2, json);
 
                  
 
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


 async alertaUpload(){
  if(this.armazenaClick){

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {

       this.alertCtrl.create({
        header: "Repertório "+this.armazenaClick,
         subHeader: "Crie uma cifra copiando",
         inputs:[
          {type:'text', name:'musica', placeholder:"Música", id:"musica", },
          {type:'text', name:'artista', placeholder:"Artista", id:"artista"},
          {type:'textarea', name:'cifra', placeholder:"Copie e cole uma cifra de outro lugar aqui dentro...", id:"cifra"},
           //{type:'file', name:'cadastro', placeholder:"Categoria", id:"avatar"}
         ],
         
         
         buttons:[
           {text: "Salvar", handler: (res)=>{

           this.presentLoadingWithOptions();

             console.log(res.cadastro);

             //let file = (<HTMLInputElement>document.getElementById('avatar')).files[0];

                         
          

             const artista = res.artista;
             const musica = res.musica;
             const cifra = res.cifra;
             this.musicaPdf = musica;
             
             
             //console.log(file);

             

                      
   
                 this.afDB.list('cifras/' + user.uid+ '/' + this.armazenaIdCat).push({

                  categoria: this.armazenaClick,
                  artista: artista,
                  musica: musica,
                  cifra: cifra,
                  usuario: user.email,
                 });
                

                 //this.listar()
                 this.listapdfstorage()

                 

               
        
             
 
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
          //console.log(listDB);
          //const childData = childSnapshot.val();
          //console.log(childKey);
       
          // ...
          });
         
          let json = [] = JSON.stringify(this.localLista);
          localStorage.setItem('ciflex'+this.armazenaClick+this.logado2, json);
          console.log("Categoria" + this.localLista);
          }, {
          onlyOnce: true
          });
         } else {
          console.log("usuário não está logado");
           // User is signed out
           // ...
           this.route.navigateByUrl('/login');
         }
      })
      
    }



     itemClick(item){
      //this.listapdfstorage(categoria);
      console.log(item.idCategoria);
      let categoria = item.idCategoria;
      let categoria2 = item.categoria;
      this.armazenaIdCat = item.idCategoria;
      this.router.navigate(['edita-cifra', {categoria, categoria2}]);
    }

    listapdfstorage(){
      const click2 = this.armazenaClick;
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        
        
        if (user) {
                 
       
          const db = getDatabase();
          const dbRef = ref(db, '/cifras/'+this.logado2+'/'+this.armazenaIdCat+'/');
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
          localStorage.setItem('ciflex'+this.armazenaIdCat+this.logado2, json);
          
          console.log(this.dataPdf);
          this.dataLocal = localStorage.getItem('ciflex'+this.armazenaIdCat+this.logado2);
          this.dataPdf = JSON.parse(this.dataLocal);
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



    deleteSpace(item){
    
      
      this.popupdelete(item)
      
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
            localStorage.setItem('categoriacifra'+this.logado2, json);
              
            this.afDB.database.ref('categoriacifra/' + user.uid +'/'+item.idCategoria+'/').remove().then(function() {
            
            //this.removeitens(item);
           
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
    this.loadingCtrl.dismiss();
   
  }
 

    }