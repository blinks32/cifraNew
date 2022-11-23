import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import {Http, HttpOptions} from '@capacitor-community/http'
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  checkIfUploaidng: any = true;
  phoneChanged: boolean;

  Slected_product: any;
  Slected_product_name: any;
  currentPlan: any;
  numOFsongs: any;
  constructor(private db: AngularFireDatabase) { }

  getAll() {

  return this.db.list('users')
  .snapshotChanges()
  .pipe(
    map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.exportVal()}));
      //this.data = changes;
        })
      );
  }
      
  doGet(url){
const options: HttpOptions = {
  url
};
return from(Http.get(options));
  }

  doPost(url): Observable<any>{
    const options: HttpOptions = {
      url,
      method: 'POST'
    };
    return from(Http.request(options));
  }
}
