import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import * as firebase from 'firebase';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  infos = [];
  ref = firebase.database().ref('infos/');

  constructor(public navCtrl: NavController, public loadingController: LoadingController) {
    this.ref.on('value', resp => {
      this.infos = [];
      this.infos = snapshotToArray(resp);
    });
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};