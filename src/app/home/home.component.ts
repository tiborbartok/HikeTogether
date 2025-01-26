import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userEmail: string;

  constructor(private authService: AuthService, private router: Router) {
    this.userEmail = this.authService.getUserEmail();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/index']);
    location.reload();
  }
}
