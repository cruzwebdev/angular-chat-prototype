import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GroupService } from '../services/group.service';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  public id: string;
  public groupChats$ = this.groupService.groups$;
  public userChats$ = this.groupService.userGroups$;


  constructor(
    private groupService: GroupService, 
    private router: Router,
  ) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.id = event.snapshot.params.id;
      }
    });
  }
}