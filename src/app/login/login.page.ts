import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: any = {};

  constructor(
    private authObj: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(){
   if(this.user.email && this.user.password){ 

    this.authObj.signInWithEmailAndPassword(this.user.email, this.user.password).then((res)=>{
    console.log(res);

    const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        localStorage.setItem('Logado', user.uid);
        localStorage.setItem('emailLogado', user.email);
        console.log("resultado "+user.email);

    });

    this.router.navigateByUrl('/db-cifras')

    

    }).catch(e =>{
    console.log(e);
    alert("Email ou senha errada, verifique para continuar...")
    })
  }
  
  }

}
