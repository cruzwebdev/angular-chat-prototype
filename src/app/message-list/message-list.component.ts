import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { sortBy } from 'sort-by-typescript';

import { GroupService } from '../services/group.service';
import { MessageService } from '../services/message.service';
import { UserService } from '../services/user.service';

import { IGroup, IMessage } from '../models';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroller', {static: false}) private feedContainer: ElementRef;

  public id: string;
  public group: IGroup;

  public messages$: Observable<IMessage[]>;
  public users$ = this.userService.users$;

  private groups$ = this.groupService.allGroups$;
  private groups: IGroup[];
  private oldestMessage: Date;

  private messages: IMessage[];

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(route => {
      this.id = route.get('id');
      this.setGroup();
    });

    this.groups$.subscribe(groups => {
      this.groups = groups;

      this.setGroup();
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private async setGroup(): Promise<void> {
    if (this.id && this.groups) {
      this.group = this.groups.find(group => group.id === this.id);

      // const messages = await this.messageService.getMessagesForGroup(this.id);

      // this.messages$.next(messages.sort(sortBy('timestamp')));

      this.messages$ = this.messageService.groupMessages$[this.id];
    }
  }

  private scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
  }
}