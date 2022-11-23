import { HttpService } from './../services/http.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { child, get, getDatabase, onDisconnect, onValue, ref } from 'firebase/database';

@Component({
  selector: 'app-db-cifras',
  templateUrl: './db-cifras.page.html',
  styleUrls: ['./db-cifras.page.scss'],
})
export class DbCifrasPage implements OnInit {

  user: any = {};
  userLogado : any = {};
  nome;
  public htmlTerms:[];
  public items:any;
  data: any[];
  dataMusicas: any[];
  public lista: [];
  public url: any;
  currentPlan: any;
  
  constructor(

    public navCtrl: NavController, 
    private router:Router,
    private http2:HttpClient,
    private loadingCtrl: LoadingController,
    private auth: AngularFireAuth,
    public checker: HttpService,
    private afDB: AngularFireDatabase,

  ) { 

    this.listadb();
    this.listadbMusicas();
  }

  async ngOnInit() {

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user;
 
        console.log(user);
            const dbRef2 = ref(getDatabase());
            get(child(dbRef2, 'users/'+user.uid)).then((snapshot) => {
              if (snapshot.exists()) {
                console.log(snapshot.val());
                this.userLogado = snapshot.val();
                if (snapshot.val().stripeDetails){
                  console.log(snapshot.val().stripeDetails);
                  this.currentPlan = snapshot.val().stripeDetails.Selected_product_name;
                  this.checker.currentPlan = this.currentPlan;
                }
                let nomevar = this.userLogado.name;
                this.nome = nomevar.slice(0,6);
                console.log(this.nome);
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error(error);
            });
      
    console.log(user);
        const dbRef = ref(getDatabase());         
        //acesso ao real database
        // ...
      } else {
        // User is signed out
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

  
  trataCategoria(estilo){
    this.router.navigate(['lista-estilo', {estilo}]);

  }

  visualizaCifra(item){
  
    const artista = item.artista;
    const musica = item.musica;
    const cifra = item.cifra;
    const artiscategoria = item.categoria;

    this.router.navigate(['cifras', {artista, musica, cifra, artiscategoria}]);

  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingCtrl.create({
    
      message: 'Aguarde...',
      cssClass: 'custom-class custom-loading',
    });
    await loading.present();
   
    this.funcaologar();
  }

logout(){
  this.router.navigate(['profile']);
 
}

criarPost(){
  this.router.navigateByUrl('post-cifra');

  }

  listadb(){
   
 
         const db = getDatabase();
         const dbRef = ref(db, '/dbCifras/'+"estilos"+'/');
         onDisconnect(dbRef);
         onValue(dbRef, (snapshot2) => {
         let trip = [];
         snapshot2.forEach((childSnapshot) => {
         console.log(childSnapshot.key)
         trip.push({
          idCategoria: childSnapshot.key,
          ...childSnapshot.val()
        });
         let json = JSON.stringify(trip);
         localStorage.setItem('estilos', json);
  
         let dataLocal = localStorage.getItem('estilos');
         this.data = JSON.parse(dataLocal);
    
       });
       console.log(this.data);
       //console.log(this.data2);
       }, {
         //onlyOnce: true
         });

    
  }

  listadbMusicas(){
   
         const db = getDatabase();
         const dbRef = ref(db, '/dbCifras/'+"topCifras");
         onDisconnect(dbRef);
         onValue(dbRef, (snapshot2) => {
         let trip = [];
         snapshot2.forEach((childSnapshot) => {
         console.log(childSnapshot.key)
         trip.push({
          idCategoria: childSnapshot.key,
          ...childSnapshot.val()
        });
         let json = JSON.stringify(trip);
         localStorage.setItem('artistas', json);
  
         let dataLocal = localStorage.getItem('artistas');
         this.dataMusicas = JSON.parse(dataLocal);
    
       });
       console.log(this.dataMusicas.length);
       this.checker.numOFsongs = this.dataMusicas.length;
       //console.log(this.data2);
       }, {
         //onlyOnce: true
         });

      
  }

}

