import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';

import * as firebase from 'firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-post-modal',
  templateUrl: 'add-post-modal.html',
})
export class AddPostModalPage {

  ref = firebase.database().ref('infos/');
  infoForm: FormGroup;

  public myPhotosRef: any;
  public myPhoto: any;
  public myPhotoURL: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private view: ViewController, 
    private formBuilder: FormBuilder, 
    private toast: ToastController,
    private camera: Camera) {

    this.infoForm = this.formBuilder.group({
      'info_title' : [null, Validators.required],
      'info_description' : [null, Validators.required]
    });

    this.myPhotosRef = firebase.storage().ref('/Photos/');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPostModalPage');
  }

  closeModal(){
    this.view.dismiss()
  }

  saveInfo(){
    let newInfo = firebase.database().ref('infos/').push();
    newInfo.set(this.infoForm.value);
    let toast = this.toast.create({
      message: 'The infos was created successfully',
      duration: 3000
    });
    toast.present();
    this.closeModal()
  }

  takePhoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
 
  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
 
  private uploadPhoto(): void {
    this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.myPhotoURL = savedPicture.downloadURL;
      });
  }
 
  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

}
