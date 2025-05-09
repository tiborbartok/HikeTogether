import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HikesFirebaseService } from '../services/hikesFirebase.service';
import { HikeParticipantDataInterface } from '../interfaces/hikeParticipantData.interface';
import { HikeInterface } from '../interfaces/hike.interface';
import { HikeParticipantDataFirebaseService } from '../services/hikeParticipantDataFirebase.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  hikesFirebaseService = inject(HikesFirebaseService);
  hikeParticipantDataFirebaseService = inject(HikeParticipantDataFirebaseService);
  hikeParticipantDataSignal = signal<HikeParticipantDataInterface[]>([]);
  hikesSignal = signal<HikeInterface[]>([]);

  formName = this.fb.nonNullable.group({
    name: [this.authService.currentUserSignal()!.username, [Validators.required]],
  });

  formPassword = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
  });

  formPhoto = this.fb.nonNullable.group({
    photoURL: [this.authService.currentUserSignal()!.photoURL, [Validators.required, Validators.pattern(/\.(png|jpg|jpeg)$/i)]],
  });

  hikesCompleted = computed(() => {
    const participantData = this.hikeParticipantDataSignal().filter(x => x.userEmail === this.authService.currentUserSignal()!.email);
    return participantData
      .map(item => this.hikesSignal().find(x => x.id === item.hikeId && x.dateAndTime.toDate() <= new Date()))
      .filter(hike => !!hike).length;
  });

  hikesShared = computed(() => {
    return this.hikesSignal().filter(x => x.userEmail === this.authService.currentUserSignal()!.email).length;
  });

  kilometersHiked = computed(() => {
    const participantData = this.hikeParticipantDataSignal().filter(x => x.userEmail === this.authService.currentUserSignal()!.email);
    return participantData
      .map(item => this.hikesSignal().find(x => x.id === item.hikeId && x.dateAndTime.toDate() <= new Date()))
      .filter(hike => !!hike)
      .reduce((total, hike) => total + (hike?.length || 0), 0);
  });

  totalUniqueHikingPartners = computed(() => {
    const allParticipations = this.hikeParticipantDataSignal();
    const userEmail = this.authService.currentUserSignal()!.email;
    if (!userEmail) return 0;
  
    const userHikeIds = allParticipations
      .filter(p => p.userEmail === userEmail)
      .map(p => p.hikeId);
  
    const relevantParticipations = allParticipations.filter(p =>
      userHikeIds.includes(p.hikeId)
    );
  
    const uniquePartnerEmails = new Set<string>();
    for (const p of relevantParticipations) {
      if (p.userEmail !== userEmail) {
        uniquePartnerEmails.add(p.userEmail);
      }
    }
  
    return uniquePartnerEmails.size;
  });

  ngOnInit(): void {
    this.hikesFirebaseService.getHikes().subscribe(hikes => {
      this.hikesSignal.set(hikes);
    });

    this.hikeParticipantDataFirebaseService.getParticipations().subscribe(participations => {
      this.hikeParticipantDataSignal.set(participations);
    });
  }

  onSubmitName(): void {
    const rawForm = this.formName.getRawValue();
    this.authService.updateUserName(rawForm.name)
      .subscribe({
        next: () => {
          this.authService.currentUserSignal()!.username = rawForm.name;
          alert("Name changed successfully.");
        },
        error: (err) => {
          alert(this.hikesFirebaseService.convertErrorMessage(err.code));
        },
      })
  }

  onSubmitPassword(): void {
    const rawForm = this.formPassword.getRawValue();

    if (rawForm.password !== rawForm.passwordConfirm) {
      alert("Passwords do not match.");
      return;
    }

    this.authService.updateUserPassword(rawForm.password)
      .subscribe({
        next: () => {
          alert("Password changed successfully.");
        },
        error: (err) => {
          alert(this.hikesFirebaseService.convertErrorMessage(err.code));
        },
      })
  }

  onSubmitPhoto(): void {
    const rawForm = this.formPhoto.getRawValue();
    this.authService.updateUserPhoto(rawForm.photoURL)
      .subscribe({
        next: () => {
          this.authService.currentUserSignal()!.photoURL = rawForm.photoURL;
          alert("Profile picture changed successfully.");
        },
        error: (err) => {
          alert(this.hikesFirebaseService.convertErrorMessage(err.code));
        },
      })
  }

  deleteUser() {
    if(confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      this.authService.deleteUserAccount()
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/index');
        },
        error: (err) => {
          alert(this.hikesFirebaseService.convertErrorMessage(err.code));
        },
      })
    }
  }
}
