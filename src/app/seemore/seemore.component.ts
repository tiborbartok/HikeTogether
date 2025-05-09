import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { HikesFirebaseService } from '../services/hikesFirebase.service';
import { HikeInterface } from '../interfaces/hike.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HikeParticipantDataFirebaseService } from '../services/hikeParticipantDataFirebase.service';
import { AuthService } from '../services/auth.service';
import { HikeParticipantDataInterface } from '../interfaces/hikeParticipantData.interface';
import { WeatherService } from '../services/weather.service';
import * as L from 'leaflet';
import { LocationService } from '../services/location.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RatingsFirebaseService } from '../services/ratingsFirebase.service';
import { RatingInterface } from '../interfaces/rating.interface';
import { CommentInterface } from '../interfaces/comment.interface';
import { CommentsFirebaseService } from '../services/commentsFirebase.service';
import { icon, Marker } from 'leaflet';

@Component({
  selector: 'app-seemore',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seemore.component.html',
  styleUrl: './seemore.component.scss'
})
export class SeemoreComponent implements OnInit{
  hikesFirebaseService = inject(HikesFirebaseService);
  hikeParticipantDataFirebaseService = inject(HikeParticipantDataFirebaseService);
  locationService = inject(LocationService);
  router = inject(Router);
  authService = inject(AuthService);
  weatherService = inject(WeatherService);
  ratingsService = inject(RatingsFirebaseService);
  commentsFirebaseService = inject(CommentsFirebaseService);
  fb = inject(FormBuilder);
  hikeId = input.required<string>();
  hikeSignal = signal<HikeInterface | null>(null);
  hikeParticipantDataSignal = signal<HikeParticipantDataInterface[]>([]);
  ratingsSignal = signal<RatingInterface[]>([]);
  commentsSignal = signal<CommentInterface[]>([]);

  weather: any | null = null;
  cityName: string | null = null;
  isLocationValid: boolean = true;

  private map: L.Map | null = null;

  participantNumber = computed(() => {
    const hikeParticipations = this.hikeParticipantDataSignal().filter(x => x.hikeId === this.hikeId());
    return hikeParticipations.length;
  });

  isUserParticipating = computed(() => {
    return this.hikeParticipantDataSignal().some(
      x => x.hikeId === this.hikeId() && x.userEmail === this.authService.currentUserSignal()!.email
    );
  });

  actualParticipation = computed(() => {
    return this.hikeParticipantDataSignal().filter(
      x => x.hikeId === this.hikeId() && x.userEmail === this.authService.currentUserSignal()!.email
    );
  });

  averageRating = computed(() => {
    if (this.ratingsSignal().length === 0) return null;
    const sum = this.ratingsSignal().reduce((rating, r) => rating + r.rating, 0);
    return (sum / this.ratingsSignal().length).toFixed(1);
  });

  hasUserRated = computed(() => {
    const ratings = this.ratingsSignal();
    return ratings.some(r => r.userEmail === this.authService.currentUserSignal()!.email);
  });

  sortedComments = computed(() => {
    return this.commentsSignal().sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime())
      .map(comment => ({
      ...comment,
      isUserMentioned: comment.comment.includes(this.authService.currentUserSignal()!.email ?? '')
    }));
  });

  formRating = this.fb.nonNullable.group({
    rating:  ['', [Validators.required]],
  });

  formComment = this.fb.nonNullable.group({
    comment:  ['', [Validators.required]],
  });

  ngOnInit(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;

    this.hikesFirebaseService.getHikeById(this.hikeId()).subscribe(hike => {
      if (hike === undefined) {
        this.router.navigateByUrl('/hikes');
        return;
      }
      this.hikeSignal.set(hike);
      this.searchWeather();
      this.initMap();

      this.ratingsService.getRatingsForHike(this.hikeId()).subscribe(ratings => {
        this.ratingsSignal.set(ratings);
      });

      this.commentsFirebaseService.getCommentsForHike(this.hikeId()).subscribe(comments => {
        this.commentsSignal.set(comments);
      });
    });

    this.hikeParticipantDataFirebaseService.getParticipations().subscribe(participations => {
      this.hikeParticipantDataSignal.set(participations);
    });
  }

  signUpToHike() {
    this.hikeParticipantDataFirebaseService.addParticipation(this.authService.currentUserSignal()!.email, this.hikeId())
      .subscribe({});
  }

  signOffFromHike() {
    this.hikeParticipantDataFirebaseService.removeParticipation(this.actualParticipation().at(0)!.id)
      .subscribe(() => {});
  }

  searchWeather = () => {
    this.weatherService.getWeather(this.hikeSignal()!.location, this.hikeSignal()!.dateAndTime.toDate()).subscribe((data) => {
      if (data === null){
        this.weather = null;
        this.cityName = null;
        return;
      }
      this.weather = data?.forecast;
      this.cityName = data?.cityName;
    });
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }
    const location = this.hikeSignal()!.location;

    this.locationService.getCoordinates(location).subscribe(coords => {
      if (coords === null) {
        this.isLocationValid = false;
        return;
      }
      this.map = L.map('map').setView([coords.lat, coords.lon], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      const marker = L.marker([coords.lat, coords.lon])
      .addTo(this.map)
      .bindPopup(`${this.hikeSignal()!.location} <br> ${coords.lat}, ${coords.lon}`)
      .openPopup();
    });
  }

  isHikeInPast(): boolean {
    const hike = this.hikeSignal();
    if (!hike) return false;
    return hike.dateAndTime.toDate() < new Date();
  }

  onRate() {
    const rawForm = this.formRating.getRawValue();
    this.ratingsService.addRating(this.authService.currentUserSignal()!.email, this.hikeSignal()!.id, Number(rawForm.rating))
      .subscribe({});
  }

  onComment() {
    const rawForm = this.formComment.getRawValue();
    this.commentsFirebaseService.addComment(this.authService.currentUserSignal()!.email, this.hikeSignal()!.id, rawForm.comment)
      .subscribe({});
  }
}
