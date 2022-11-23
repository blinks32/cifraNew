import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { getDatabase, onDisconnect, onValue, ref } from 'firebase/database';

@Component({
  selector: 'app-lista-cifras',
  templateUrl: './lista-cifras.page.html',
  styleUrls: ['./lista-cifras.page.scss'],
})
export class ListaCifrasPage {
  categories : any[];
  jsonData:any = [];
  artista;
  musica;
  filterTerm: string;

  constructor(
    public navCtrl: NavController, 
    public http: HttpClient, 
    private activeRoutes: ActivatedRoute,
    private router:Router,
    private loadingCtrl: LoadingController,

    ) {
      
      //this.presentLoadingWithOptions();
    this.pegaLista();
    this.loadData();
    }

    pegaLista(){
      this.artista = this.activeRoutes.snapshot.paramMap.get('artista');
      //this.musica = this.activeRoutes.snapshot.paramMap.get('musica');
    }
   
    
  loadData() {

   
    
    const db = getDatabase();
    const dbRef = ref(db, '/dbCifras/'+"cifras"+'/'+this.artista);
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
    //localStorage.setItem('artistas', json);

    //let dataLocal = localStorage.getItem('artistas');
     this.categories = JSON.parse(json);

  });
  console.log(this.categories);
  //console.log(this.data2);
  //this.loadingCtrl.dismiss()
 }, {
    //onlyOnce: true
    });

   
  }

  itemClick(item){

    const artista = item.artista;
    const musica = item.musica;
    const cifra = item.cifra;
    const artiscategoria = item.categoria;

    this.router.navigate(['cifras', {artista, musica, cifra, artiscategoria}]);
    console.log(item);
    //alert(itemClick);


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

  goBack() {
    this.navCtrl.back();
    }

}
