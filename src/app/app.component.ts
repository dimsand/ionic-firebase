import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';

import { PostPage } from '../pages/post/post';

const config = {
  apiKey: 'AIzaSyB7Z9INZo7lvbZtws4RcrGmUIQb_RA3Rg0',
  authDomain: 'ionicgeolocalise.firebaseapp.com',
  databaseURL: 'https://ionicgeolocalise.firebaseio.com',
  projectId: 'ionicgeolocalise',
  storageBucket: 'ionicgeolocalise.appspot.com',
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = PostPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#333')
      splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
