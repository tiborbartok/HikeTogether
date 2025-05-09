import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HikesFirebaseService } from '../services/hikesFirebase.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  hikesFirebaseService = inject(HikesFirebaseService);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit(): void {
    const rawForm = this.form.getRawValue();

    if (rawForm.password !== rawForm.passwordConfirm) {
      alert("Passwords do not match.");
      return;
    }

    this.authService.register(rawForm.email, rawForm.username, rawForm.password)
    .subscribe({
      next: () => {
      this.router.navigateByUrl('/home');
      window.location.reload();
      },
      error: (err) => {
        alert(this.hikesFirebaseService.convertErrorMessage(err.code));
      },
    })
  }
}
