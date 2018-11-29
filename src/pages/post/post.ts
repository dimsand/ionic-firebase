import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';

import * as firebase from 'firebase';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  posts = [];
  ref = firebase.database().ref('posts/');

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public loadingController: LoadingController
    ) {

    this.ref.on('value', resp => {
      this.posts = [];
      this.posts = snapshotToArray(resp);
    });
  }

  openModal(){
    const addPostModal = this.modalCtrl.create('AddPostModalPage')
    addPostModal.present()
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