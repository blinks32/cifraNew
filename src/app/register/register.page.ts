import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user:any = {};

  constructor(
    private authOj: AngularFireAuth,
    private router: Router,
    private afDB: AngularFireDatabase
  ) { }

  ngOnInit() {
  }

  register(){

    if(this.user.email && this.user.password && this.user.name){
    this.authOj.createUserWithEmailAndPassword(this.user.email, this.user.password).then((r) => {
      console.log(r);

      this.afDB.object('users/' + r.user.uid).set({

        name: this.user.name,
        email: this.user.email,
        createdAt: Date.now(),

      }).then(()=>{

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
          localStorage.setItem('Logado', user.uid);
          console.log("resultado "+user.uid);

      });

      this.router.navigateByUrl('/db-cifras');

      });


    }).catch(e =>{
     console.log(e); 
    })
    }
  }

}
