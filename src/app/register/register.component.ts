import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  private router = inject(Router);

  constructor(private formBuilder:FormBuilder, private authService: AuthService) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onRegister() {
    const { email, password } = this.registerForm.value;
    this.authService
      .signUp(email, password)
      .then(() => this.router.navigate(['/login']))
      .catch((error) => alert(`Error: ${error.message}`));
  }
}
