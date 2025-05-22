import { Component, computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HikesFirebaseService } from '../services/hikesFirebase.service';
import { HikeInterface } from '../interfaces/hike.interface';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { HikeParticipantDataFirebaseService } from '../services/hikeParticipantDataFirebase.service';
import { HikeParticipantDataInterface } from '../interfaces/hikeParticipantData.interface';
import { AuthService } from '../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-hikes',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './hikes.component.html',
  styleUrl: './hikes.component.scss'
})
export class HikesComponent implements OnInit{
  hikesFirebaseService = inject(HikesFirebaseService);
  hikeParticipantDataFirebaseService = inject(HikeParticipantDataFirebaseService);
  router = inject(Router);
  authService = inject(AuthService);
  hikesSignal = signal<HikeInterface[]>([]);  
  userParticipations = signal<HikeParticipantDataInterface[]>([]);
  searchQueryAll = signal<string>('');
  searchQueryRecommended = signal<string>('');
  pageAll: number = 1;
  pageRecommended: number = 1;
  
  allHikes = computed(() => {
    const sq = this.searchQueryAll();
    return this.hikesSignal().filter(x => x.name.toLowerCase().includes(sq.toLowerCase()) && x.dateAndTime.toDate() > new Date())
      .sort((a, b) => a.dateAndTime.toDate().getTime() - b.dateAndTime.toDate().getTime());
  });

  mostFrequentDifficulty = computed(() => {
    const userHikeIds = this.userParticipations().map(p => p.hikeId);
    const userHikes = this.hikesSignal().filter(hike => userHikeIds.includes(hike.id));
  
    const frequency: Record<string, number> = {};
    userHikes.forEach(hike => {
      frequency[hike.difficulty] = (frequency[hike.difficulty] || 0) + 1;
    });
  
    return Object.entries(frequency).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  });

  recommendedHikes = computed(() => {
    const sq = this.searchQueryRecommended();
    if (!this.mostFrequentDifficulty()) return [];
    return this.hikesSignal().filter(hike =>
      hike.name.toLowerCase().includes(sq.toLowerCase()) && hike.difficulty === this.mostFrequentDifficulty() && hike.dateAndTime.toDate() > new Date())
        .slice(0, 6)
  });

  ngOnInit(): void {
    this.hikesFirebaseService.getHikes().subscribe(hikes => {
      this.hikesSignal.set(hikes);
    });

    this.hikeParticipantDataFirebaseService.getParticipations().subscribe(participations => {
      const userParticipations = participations.filter(p => p.userEmail === this.authService.currentUserSignal()!.email);
      this.userParticipations.set(userParticipations);
    });
  }

  filterAll(searchQueryAll: string) {
    this.searchQueryAll.set(searchQueryAll);
    this.pageAll = 1;
  }

  filterRecommended(searchQueryRecommended: string) {
    this.searchQueryRecommended.set(searchQueryRecommended);
    this.pageRecommended = 1;
  }

  addHike(name: string, location: string, dateAndTime: Date, difficulty: string, capacity: number, length: number,
      extraInformation: string, userEmail: string, id: string): void{
    const newHike: HikeInterface = {name, location, dateAndTime: Timestamp.fromDate(dateAndTime),
      difficulty, capacity, length, extraInformation, userEmail, id};
      
    this.hikesSignal.update(hikes => [...hikes, newHike]);
  }

  seeMore(hikeId: string){
    this.router.navigateByUrl('hikes/' + hikeId);
  }
}
