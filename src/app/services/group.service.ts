import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

import { IGroup } from '../models';
import { UserService } from './user.service';

@Injectable()
export class GroupService {
  public groups$ = new BehaviorSubject<IGroup[]>([]);
  public userGroups$: Observable<IGroup[]>;
  public allGroups$: Observable<IGroup[]>;

  private unmapedUserGroups$ = new BehaviorSubject<IGroup[]>([]);
  private users$ = this.userService.users$;
  private currentUser: string;

  constructor(
    private db: AngularFirestore,
    private userService: UserService,
  ) { 
    this.subscribeToCurrentUser();
    this.subscribeToUserGroups();

    this.allGroups$ = combineLatest(this.groups$, this.userGroups$, (groups, userGroups) => [...groups, ...userGroups]);

  }

  private subscribeToCurrentUser(): void {
    this.userService.currentUser$.subscribe(id => {

      if (id) {
        this.currentUser = id;

        this.subscribeGroups();
      }
    });
  }

  private subscribeGroups(): void {
    // Groups
    this.db
      .collection('groups', ref => ref
        .where('individual', '==', false)
        .where('users', 'array-contains', this.currentUser)
      )
      .snapshotChanges()
      .subscribe(async snapshot => {
        this.groups$.next(await this.mapSnapshotToGroup(snapshot));
      });

    // Individual groups
    this.db
      .collection('groups', ref => ref.where('individual', '==', true))
      .snapshotChanges()
      .subscribe(async snapshot => {
        this.unmapedUserGroups$.next(await this.mapSnapshotToGroup(snapshot));
      });
  }

  private subscribeToUserGroups(): void {
    this.userGroups$ = combineLatest(this.unmapedUserGroups$, this.users$, (groups, users) => {
      return groups
        .map(group => ({ 
          ...group,
          name: users[group.users[0]].displayName,
        }))
        .filter(group => !group.users.find(id => id === this.currentUser));
    });
  }

  private async mapSnapshotToGroup(snapshot): Promise<IGroup[]> {
    const data: IGroup[] = await snapshot.map(async doc => {
      const group = await doc.payload.doc.data() as IGroup;
      
      return {
        id: doc.payload.doc.id,
        ...group
      }
    });

    return Promise.all(data);
  }
}