import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HikeInterface } from '../interfaces/hike.interface';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HikesFirebaseService } from '../services/hikesFirebase.service';
import { HikeParticipantDataInterface } from '../interfaces/hikeParticipantData.interface';
import { HikeParticipantDataFirebaseService } from '../services/hikeParticipantDataFirebase.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-myhikes',
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './myhikes.component.html',
  styleUrl: './myhikes.component.scss'
})
export class MyhikesComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  hikesFirebaseService = inject(HikesFirebaseService);
  hikeParticipantDataFirebaseService = inject(HikeParticipantDataFirebaseService);
  hikesSignal = signal<HikeInterface[]>([]);
  hikeParticipantDataSignal = signal<HikeParticipantDataInterface[]>([]);
  searchQueryUpcoming = signal<string>('');
  searchQueryShared = signal<string>('');
  searchQueryCompleted = signal<string>('');
  pageUpcoming: number = 1;
  pageShared: number = 1;
  pageCompleted: number = 1;

  mySharedHikes = computed(() => {
    const sq = this.searchQueryShared();
    return this.hikesSignal().filter(x => x.name.toLowerCase().includes(sq.toLowerCase()) && x.userEmail === this.authService.currentUserSignal()!.email)
      .sort((a, b) => a.dateAndTime.toDate().getTime() - b.dateAndTime.toDate().getTime());
  });

  myUpcomingHikes = computed(() => {
    const sq = this.searchQueryUpcoming();
    const participantData = this.hikeParticipantDataSignal().filter(x => x.userEmail === this.authService.currentUserSignal()!.email);
    return participantData
      .map(item => this.hikesSignal().find(x => x.id === item.hikeId && x.dateAndTime.toDate() > new Date()))
      .filter(hike => !!hike)
      .sort((a, b) => a!.dateAndTime.toDate().getTime() - b!.dateAndTime.toDate().getTime())
      .filter(x => x.name.toLowerCase().includes(sq.toLowerCase()));
  });

  myCompletedHikes = computed(() => {
    const sq = this.searchQueryCompleted();
    const participantData = this.hikeParticipantDataSignal().filter(x => x.userEmail === this.authService.currentUserSignal()!.email);
    return participantData
    .map(item => this.hikesSignal().find(x => x.id === item.hikeId && x.dateAndTime.toDate() <= new Date()))
    .filter(hike => !!hike)
    .sort((a, b) => a.dateAndTime.toDate().getTime() - b.dateAndTime.toDate().getTime())
    .filter(x => x.name.toLowerCase().includes(sq.toLowerCase()));
  });

  ngOnInit(): void {
    this.hikesFirebaseService.getHikes().subscribe(hikes => {
      this.hikesSignal.set(hikes);
    });

    this.hikeParticipantDataFirebaseService.getParticipations().subscribe(participations => {
      this.hikeParticipantDataSignal.set(participations);
    });
  }

  seeMore(hikeId: string){
    this.router.navigateByUrl('hikes/' + hikeId);
  }

  filterUpcoming(searchQueryUpcoming: string) {
    this.searchQueryUpcoming.set(searchQueryUpcoming);
    this.pageUpcoming = 1;
  }

  filterShared(searchQueryShared: string) {
    this.searchQueryShared.set(searchQueryShared);
    this.pageShared = 1;
  }

  filterCompleted(searchQueryCompleted: string) {
    this.searchQueryCompleted.set(searchQueryCompleted);
    this.pageCompleted = 1;
  }
}
