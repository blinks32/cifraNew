import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides} from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, child, get } from "firebase/database";


@Component({
  selector: 'app-slides-intro',
  templateUrl: './slides-intro.page.html',
  styleUrls: ['./slides-intro.page.scss'],
})
export class SlidesIntroPage implements OnInit {

  @ViewChild('mySlider')  slides: IonSlides;

  user: any = {};
  userLogado:any = {};
  userUpload: any = {};
  constructor(
    private auth: AngularFireAuth,
    private afStore: AngularFireStorage,
    private afDB: AngularFireDatabase,
    private rotas:Router 
    
    ) { }

    async ngOnInit() {
    
      //quem está logado
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          this.user = user;
          console.log(this.user);
          this.rotas.navigateByUrl('/home');
          //acesso ao real database
          const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            this.userLogado = snapshot.val();
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
          // ...
        } else {
          // User is signed out
          // ...
  
        }
      });
      this.afDB.object('user/'+this.user.uid).snapshotChanges().subscribe((usersnap:any)=>{
        this.userUpload = { 'key': usersnap.key, ...usersnap.payload.val() };
        console.log(this.user.uid);
      })
      }
  
  
  swipeNext(){
    this.slides.slideNext();
  }
  mudarPagina(){
  this.rotas.navigateByUrl('/login')
 
  }

}
