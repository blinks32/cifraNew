import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, onDisconnect, onValue, ref } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


@Component({
  selector: 'app-lista-estilo',
  templateUrl: './lista-estilo.page.html',
  styleUrls: ['./lista-estilo.page.scss'],
})
export class ListaEstiloPage {

  categories : any[];
  estilo: any;
  filterTerm: string;



  constructor(
    public navCtrl: NavController, 
    public http: HttpClient, 
    private activeRoutes: ActivatedRoute,
    private router:Router,
    private loadingCtrl: LoadingController,
    ) {

      this.pegaCategoria();
      this.loadData();
  
    }

  pegaCategoria(){
    this.estilo = this.activeRoutes.snapshot.paramMap.get('estilo');
    console.log(this.estilo);
  }

    
  loadData() {



        // User is signed in, logado
       
        //this.uid = user.uid;
  
         const db = getDatabase();
         const dbRef = ref(db, '/dbCifras/'+"artistas"+'/'+this.estilo);
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
  
   
  

  

  

  itemClick(artista){

    this.router.navigate(['lista-cifras', {artista}]);

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


}
