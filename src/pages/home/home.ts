import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, ModalController, ToastController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

import * as firebase from 'firebase';
import { Subscription} from 'rxjs/Subscription';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  ref = firebase.database().ref('geolocations/');
  connected: Subscription;
  disconnected: Subscription;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    private geolocation: Geolocation,
    private device: Device,
    public modalCtrl: ModalController,
    private network: Network,
    private toast: ToastController, 
    ) {

    platform.ready().then(() => {
      console.log('test')
      this.initMap();
    });

    this.ref.on('value', resp => {
      //this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        console.log(data)
        if(data.uuid !== this.device.uuid) {
          let image = 'assets/imgs/walker-yellow.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        } else {
          let image = 'assets/imgs/walker.png';
          let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
          this.addMarker(updatelocation,image);
          this.setMapOnAll(this.map);
        }
      });
    });

  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
   
    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  openModal(){
    const addPostModal = this.modalCtrl.create('AddPostModalPage')
    addPostModal.present()
  }

  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: mylocation
      });
      console.log(this.map)
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      console.log('nouvelle localisation')
      this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      let image = 'assets/imgs/walker.png';
      //this.deleteMarkers();
      this.addMarker(updatelocation,image);
      this.setMapOnAll(this.map);
    });
  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image,
      animation: google.maps.Animation.DROP,
      title: "Ma position actuelle"
    });

    let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

    if(marker.getPosition() !== undefined){
      this.map.setCenter(marker.getPosition());
    }
    this.markers.push(marker);
    this.toast.create({
      message: `Nouvelle position`,
      duration: 1000
    }).present();
  }
  
  setMapOnAll(map) {
    for(var i = 0; i < this.markers.length - 1; i++){
      this.markers[i].title = "Mon ancienne position " + i
      this.markers[i].icon = 'assets/imgs/walker-yellow.png'
    }
    for (var j = 0; j < this.markers.length; j++) {
      this.markers[j].setMap(map);
    }    
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  updateGeolocation(uuid, lat, lng) {
    if(localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude : lng
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng
      });
      localStorage.setItem('mykey', newData.key);
    }
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
