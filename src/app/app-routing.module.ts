import {NgModule} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';
import { ActivatedRoute, Params} from '@angular/router';
import { AppComponent } from './app.component';
import { MessageListComponent } from './message-list/message-list.component';

const appRoutes:Routes=[
  {
    path: 'chat/:id',
    component: MessageListComponent
  },
]

@NgModule({
imports:[RouterModule.forRoot(appRoutes)],
exports:[RouterModule]
})
export class AppRoutingModule{}