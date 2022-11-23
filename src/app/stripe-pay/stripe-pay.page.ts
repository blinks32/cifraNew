import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { AvatarService } from 'src/app/services/avatar.service';
// import { OverlayService } from 'src/app/services/overlay.service';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { HttpService } from '../services/http.service';
import { getDatabase, push, ref, update } from 'firebase/database';
import { Router } from '@angular/router';

declare var Stripe
@Component({
  selector: 'app-stripe-pay',
  templateUrl: './stripe-pay.page.html',
  styleUrls: ['./stripe-pay.page.scss'],
})
export class StripePayPage implements OnInit {

  @ViewChild('paymentform',{read:ElementRef}) stripeButton : ElementRef;
  cardpaymentForm: FormGroup;
  public data: any;
  info: any;
  approve: boolean;
  stripe = Stripe('pk_test_0t85o0Llo0MbBfC9imSzznam');
  card: any;
  cards: any[];
  selectedCard: any;
  selected: any;
  skeletOns: {}[];
  cash: any = 'cash'
  user: any;
  planos;

  constructor( 
    public nav: NavController, private http: HttpClient, public connector: HttpService,
    public alertCtrl: AlertController, public formBuilder: FormBuilder, public route: Router) {}



  ionViewDidEnter() {
    this.skeletOns = [
      {},{},{},{},{}
    ]
    this.setupStripe();


      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        this.user = user;
      })
      
      if(this.connector.Slected_product_name == 'free'){
        this.planos = 'Plano com direito a 05 cifras no armazenamento em PDF / Copiadas do App'
      }if(this.connector.Slected_product_name == 'standard'){
        this.planos = 'Plano com direito a 100 cifras no armazenamento em PDF / Copiadas do App'
      }if(this.connector.Slected_product_name == 'premuim'){
        this.planos = 'Plano com direito a 500 cifras no armazenamento em PDF / Copiadas do App'
      }

      console.log(this.connector.Slected_product_name);

  }



async SubcribeToPlan(data) {
  try {
  const headers = new HttpHeaders();
  headers.append('Conent-Type', 'application/x-www-form-urlencoded');
  // tslint:disable-next-line: object-literal-shorthand
  this.http.post('https://intense-citadel-53666.herokuapp.com/sendmail', data, { headers: headers }).subscribe((res) => {
    if (res) {
      console.log(res);
    }
    
  });
}catch(e){
  console.log(e);
}
}


  async setupStripe() {
    const appearance = {
      theme: 'flat',
    
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '4px',
        // See all possible variables below
      }
    };
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '17px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#3880ff'
      }
    };

    this.card = elements.create('card', { style: style });
    this.card.mount('#card-element');

    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      console.log(event, this.card)
      this.approve = true;

      this.stripe.createSource(this.card).then(async result => {
        this.approve = false;
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
          // this.overlay.showAlert('Payment Error', result.error.message)
        } else {
          console.log(result);

          let data = {
            email: this.user.email,
            id: result.source.id,
            product_id: this.connector.Slected_product,
            amt: 20
          }
              await this.SubcribeToPlan(data);
                const db = await getDatabase();
                  update(ref(db,  'users' + '/' + this.user.uid + '/stripeDetails'), {
                    Stripe_id: result.source.id,
                    Selected_product_id: this.connector.Slected_product,
                    Selected_product_name: this.connector.Slected_product_name,
                    createdAt: Date.now()
                 })

                 await this.showPayMentAlert('Success', 'Youve been subscribed')

                 
           
          this.card.removeEventListener('change', event=>{})
          form.removeEventListener('submit', event=>{})
         
        }
      });
    });
  }
  




  async showPayMentAlert(title, subtitle) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: subtitle,
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        handler: () => {
          this.route.navigateByUrl('/profile');
        }
      },],
      backdropDismiss: false
    });
    alert.present();
  }

  ngOnInit() {

  }
  goBack() {
    this.nav.back();
    }

}


