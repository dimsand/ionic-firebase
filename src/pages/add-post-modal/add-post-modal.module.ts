import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPostModalPage } from './add-post-modal';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddPostModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPostModalPage),
  ],
})
export class AddPostModalPageModule {}
