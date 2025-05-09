import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HikesFirebaseService } from '../services/hikesFirebase.service';
import { HikesComponent } from '../hikes/hikes.component';

@Component({
  selector: 'app-share-hike',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './share-hike.component.html',
  styleUrl: './share-hike.component.scss'
})
export class ShareHikeComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  hikesFirebaseService = inject(HikesFirebaseService);
  hikesComponent = inject(HikesComponent);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    location: ['', [Validators.required]],
    dateAndTime: ['', [Validators.required]],
    difficulty: ['', [Validators.required]],
    capacity: ['', [Validators.required, Validators.min(1), Validators.max(999)]],
    length: ['', [Validators.required, Validators.min(0), Validators.max(999)]],
    extraInformation: ['',]
  });

  onSubmit() {
    const rawForm = this.form.getRawValue();
    this.hikesFirebaseService
      .createHike(rawForm.name, rawForm.location, new Date(rawForm.dateAndTime), rawForm.difficulty, Number(rawForm.capacity), Number(rawForm.length),
        rawForm.extraInformation)
      .subscribe(createdHikeId => {
        this.hikesComponent
          .addHike(rawForm.name, rawForm.location, new Date(rawForm.dateAndTime), rawForm.difficulty, Number(rawForm.capacity), Number(rawForm.length),
            rawForm.extraInformation, this.authService.currentUserSignal()!.email, createdHikeId);
      })
      this.router.navigateByUrl('/myhikes');
  }
}
