import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {

email: any;

  constructor(
    private auth: AngularFireAuth,
    private rout: Router

  ) { }

  ngOnInit() {
  }

  reset(){
    this.auth.sendPasswordResetEmail(this.email).then((r) => {
      console.log(r);
      alert("Confira a caixa de entrada do seu email...");
    }).catch(e => {
      console.log(e)
    })
  }

}
